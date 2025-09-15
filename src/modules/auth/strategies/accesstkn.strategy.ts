import {
    BadRequestException,
    Injectable,
    Req,
    UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from 'src/config/config';
import { Request } from 'express';
import * as msg from "../../../common/utils/helper/message";
import { StaffService } from '../../staff/staff.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly staffService: StaffService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwtAccessTknSecret,
            passReqToCallback: true,
        });
    }

    async validate(@Req() req: Request, payload: any) {

        if (!payload)
            throw (
                new UnauthorizedException({
                    status: 400,
                    success: false,
                    message: msg.invalidTkn,
                    data: null
                })
            );

        const { userId, compId, branchId, domain } = req.body;

        const verifyReqUser: any = await this.staffService.validateReqestedUser({ userId, compId, branchId, domain }, payload);

        if (!verifyReqUser || payload?.purpose !== "ROLE_ACCESS")
            throw (
                new UnauthorizedException({
                    status: 401,
                    success: false,
                    message: msg.invalidExpireTkn,
                    data: null
                })
            );

        if (payload.branchId === undefined || payload.branchId === null || payload.branchId === 0) {
            throw (
                new BadRequestException({
                    status: 400,
                    success: false,
                    message: msg.validationError("Branch Id"),
                    data: null
                })
            );
        }

        return { tknPayload: payload, loginUser: verifyReqUser };
    }
}
