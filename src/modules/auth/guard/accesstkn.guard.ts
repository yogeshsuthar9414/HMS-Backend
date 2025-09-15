import {
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
    constructor(@Inject(Reflector) private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any) {

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
