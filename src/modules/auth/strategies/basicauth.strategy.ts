import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import config from '../../../config/config';
import * as msg from '../../../common/utils/helper/message';
import * as crypto from 'crypto';

import { BasicStrategy } from 'passport-http';

@Injectable()
export class BasicauthStrategy extends PassportStrategy(
  BasicStrategy,
  'basicauth',
) {
  constructor() {
    super();
  }

  compareBasicValidation(a: string, b: string) {
    const bufferA = Buffer.from(a);
    const bufferB = Buffer.from(b);
    if (bufferA.length !== bufferB.length) return false;
    return crypto.timingSafeEqual(bufferA, bufferB);
  }

  async validate(username: string, password: string) {
    try {
      const basicAuthUserNm = config.basicAuthUsername;
      const basicAuthPassword = config.basicAuthPassword;

      if (
        !this.compareBasicValidation(username, basicAuthUserNm) ||
        !this.compareBasicValidation(password, basicAuthPassword)
      ) {
        throw new UnauthorizedException({
          status: 401,
          success: false,
          message: msg.invalidBasicAuthTkn,
          data: null,
        });
      }

      return { username };
    } catch (error) {
      if (error.name === "UnauthorizedException") {
        throw new UnauthorizedException({
          status: 401,
          success: false,
          message: msg.invalidBasicAuthTkn,
          data: null,
        });
      } else {
        console.log('error', error);
      }
    }
  }
}
