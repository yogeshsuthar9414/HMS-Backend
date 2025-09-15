import { BadRequestException, Injectable, Req, Res, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request, Response } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { HelperService } from "../../../common/utils/helper/helper.service";
import config from "src/config/config";
import { StaffService } from "../../staff/staff.service";
import * as msg from "../../../common/utils/helper/message"

@Injectable()
export class TempTokenStrategy extends PassportStrategy(Strategy, "jwt-temp") {
    constructor(
        private helperService: HelperService,
        private staffService: StaffService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwtTempTknSecret,
            passReqToCallback: true,
        });
    }

    async validate(@Req() req: Request, payload: any) {

        const { userId, compId, branchId, domain } = req.body;

        // Here Session out and navigate to login on frontend side
        if (!payload)
            throw (
                new UnauthorizedException({
                    status: 403,
                    success: false,
                    message: msg.invalidExpireTkn,
                    data: null
                })
            );

        // Validate Request user
        const verifyReqUser: any = await this.staffService.validateReqestedUser({ userId, compId, branchId, domain });

        if (payload.branchId === undefined || payload.branchId === null || payload.branchId === 0) {
            throw (
                new BadRequestException({
                    status: 401,
                    success: false,
                    message: msg.validationError("Branch Id"),
                    data: null
                })
            );
        }

        const validateTkn = this.helperService.validateTempToken(payload, verifyReqUser);

        if (!validateTkn) {
            throw (
                new UnauthorizedException({
                    status: 401,
                    success: false,
                    message: msg.invalidTkn,
                    data: null
                })
            );
        }

        return { tknPayload: payload, loginUser: verifyReqUser };
    }
};