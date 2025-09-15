import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import config from 'src/config/config';
import { HelperService } from './helper.service';

@Injectable()
export class GenerateTknService {
  constructor(
    private jwtService: JwtService,
    private helperService: HelperService
  ) { }

  async tempTkn(req: Request, generateSessionId: string, userData: any, tempSecret: string, purpose: string) {
    const body = req.body;

    const tknPayload = {
      userId: userData.id,
      compId: userData.comp_id,
      branchId: userData.branch_id,
      role: userData.role,
      tempSecret: tempSecret,
      sessionId: generateSessionId,
      purpose: purpose,
      ipAddress: body?.ipAddress !== '' ? body?.ipAddress : req.ip,
    };

    const tkn = await this.jwtService.sign(tknPayload, {
      secret: config.jwtTempTknSecret,
      expiresIn: config.jwtTempTknTm,
    });

    return tkn;
  }

  async accessToken(loginDtl: any, generateSessionId: string, req: Request) {
    const body = req.body;

    const tknPayload = {
      userId: loginDtl.id,
      compId: loginDtl.comp_id,
      branchId: loginDtl.branch_id,
      role: loginDtl.role,
      sessionId: generateSessionId,
      purpose: "ROLE_ACCESS",
      ipAddress: body?.ipAddress !== "" && body?.ipAddress !== "string" ? body?.ipAddress : req.ip,
    }

    const accessTkn = await this.jwtService.sign(tknPayload, {
      secret: config.jwtAccessTknSecret,
      expiresIn: config.jwtAccessTknTm,
    });

    const decodedToken = JSON.parse(atob(accessTkn.split('.')[1])); // Basic decoding of payload
    const accessTknExpire = this.helperService.getUTCTime(new Date(decodedToken.exp * 1000).toISOString());

    return { accessTkn, accessTknExpire };
  }

  async refreshToken(loginDtl: any, generateSessionId: string, req: Request) {
    const body = req.body;

    const tknPayload = {
      userId: loginDtl.id,
      compId: loginDtl.comp_id,
      branchId: loginDtl.branch_id,
      role: loginDtl.role,
      sessionId: generateSessionId,
      purpose: "ROLE_REFRESH",
      ipAddress: body?.ipAddress !== "" && body?.ipAddress !== "string" ? body?.ipAddress : req.ip,
    }

    const refreshTkn = await this.jwtService.sign(tknPayload, {
      secret: config.jwtRefreshTknSecret,
      expiresIn: config.jwtRefreshTknTm,
    });

    const decodedToken = JSON.parse(atob(refreshTkn.split('.')[1])); // Basic decoding of payload
    const refreshTknExpire = this.helperService.getUTCTime(new Date(decodedToken.exp * 1000).toISOString());

    return { refreshTkn, refreshTknExpire };
  }
}
