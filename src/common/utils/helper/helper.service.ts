import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import config from '../../../config/config';
import * as msg from './message';
import * as CryptoJS from 'crypto-js';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';
import * as bcrypt from 'bcrypt';
import * as  moment from 'moment';


@Injectable()
export class HelperService {
  generateRendomOTP = () => {
    const rendomOTP = Math.floor(100000 + Math.random() * 900000);
    return config.nodeEnv === 'LIVE' ? rendomOTP : 999999;
  };

  response(
    res: Response,
    statusCode: number,
    success: boolean,
    message: string,
    data: any,
  ) {
    return res?.status(statusCode).json({
      status: statusCode,
      success: success,
      message: message,
      data: data,
    });
  }

  exceptionHandler(err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedException({
        status: 401,
        success: false,
        message: msg.invalidBasicAuthTkn,
        data: null,
      });
    } else {
      console.log("error", err);
      throw new InternalServerErrorException({
        status: 500,
        success: false,
        message: msg.inconvenienceHappened,
        data: null,
      });
    }
  }

  encryptValue(val) {
    return CryptoJS.AES.encrypt(
      JSON.stringify(val),
      process.env.CRYPTO_SECRET_KEY,
    ).toString();
  }

  async generateGauthQrCode(userInfo) {
    const secret = speakeasy.generateSecret({
      name: `${userInfo.company.comp_nm} (${userInfo.user_nm})`,
    });

    try {
      const gAuthQrCode = await new Promise((resolve, reject) => {
        qrCode.toDataURL(secret.otpauth_url, (err, data_url) => {
          if (err) return reject(err);
          resolve(data_url);
        });
      });

      return { gAuthQrCode, key: secret.base32 };
    } catch (error) {
      return { gAuthQrCode: '', key: '' };
    }
  }

  getUTCTime(dateTimeString: string) {
    const dt = new Date(dateTimeString);
    const dtNumber = dt.getTime();
    const dtOffset = dt.getTimezoneOffset() * 60000;
    const dtUTC = new Date();
    dtUTC.setTime(dtNumber - dtOffset);
    return dtUTC;
  }

  dateFormat(date: Date) {
    return moment(date).format("DD-MM-YYYY h:mm:ss a");
  }


  validateTempToken(tknPayload, reqUserData: any) {

    if (tknPayload?.purpose === "generate_two_factor_auth_token") {
      if (tknPayload?.userId === reqUserData.id && tknPayload?.compId === reqUserData.comp_id && tknPayload?.branchId === reqUserData.branch_id && tknPayload?.role === reqUserData.role && tknPayload?.tempSecret === reqUserData.temp_gauth_key) {
        return true;
      }
    } else if (tknPayload?.purpose === "two_factor_auth_token") {
      if (tknPayload?.userId === reqUserData.id && tknPayload?.compId === reqUserData.comp_id && tknPayload?.branchId === reqUserData.branch_id && tknPayload?.role === reqUserData.role && tknPayload?.tempSecret === reqUserData.gauth_key) {
        return true;
      }
    } else if (tknPayload?.purpose === "OTP_verification") {
      if (tknPayload?.userId === reqUserData.id && tknPayload?.compId === reqUserData.comp_id && tknPayload?.branchId === reqUserData.branch_id && tknPayload?.role === reqUserData.role && tknPayload?.tempSecret === reqUserData.otp_cd.toString()) {
        return true;
      }
    }

    return false;
  }

  async bcyptPassword(pass: string) {
    return await bcrypt.hash(pass, 10);
  }
}
