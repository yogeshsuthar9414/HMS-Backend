import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as msg from "../utils/helper/message";


export const roles = [
  "SUP", // Superadmin
  "ADM", // Hospital Admin
  "MNG", // Manager
  "RECP", // Reception
  "DOC", // Doctor
  "NRS", // Nurse
  "LAB", // Lab Asistance
  "PHR", // Pharmasis
  "ACC" // Account
]


@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      "roles",
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true; // No roles required → public route
    }

    // Get user from request (set by AuthGuard / JWT Strategy)
    const { user } = context.switchToHttp().getRequest();

    if (requiredRoles.some((role) => role === user.tknPayload?.role)) {
      return true;
    } else {
      throw (
        new BadRequestException({
          status: 400,
          success: false,
          message: msg.notPermission,
          data: null
        })
      );
    }

    // Check if user has at least one of the required roles
  }
}
