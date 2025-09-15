import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TempTokenGuard extends AuthGuard('jwt-temp') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any) {

        if (err || !user) {
            throw (
                err ||
                new UnauthorizedException({
                    status: 400,
                    message: 'Your token has been exprity. Please login again',
                })
            );
        }
        return user;
    }
}
