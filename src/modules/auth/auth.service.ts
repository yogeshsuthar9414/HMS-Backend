import {
  Body,
  Inject,
  Injectable,
  LoggerService,
  Req,
  Res,
} from '@nestjs/common';
import { loginDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { StaffService } from '../staff/staff.service';
import * as bcrypt from 'bcrypt';
import { HelperService } from '../../common/utils/helper/helper.service';
import config from 'src/config/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { GenerateTknService } from '../../common/utils/helper/generate-tkn.service';
import { DatabaseService } from 'src/database/database.service';
import { verifyGAuthOtpDto } from './dto/verifyGAuthOtp.dto';
import * as speakeasy from 'speakeasy';
import { verifyOtpDto } from './dto/verifyOtp.dto';
import { sendMail } from '../../common/email/email.service';
import { sendOTPTemplate } from '../../common/email/templates/email.content';
import * as msg from "../../common/utils/helper/message";
import { logoutOutDto } from './dto/logout.dto';
import { refreshTokenDto } from './dto/refreshTkn.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthServices {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly staffService: StaffService,
    private readonly helperService: HelperService,
    private readonly generateTknService: GenerateTknService,
    private readonly prisma: DatabaseService,
    private readonly jwtService: JwtService
  ) { }

  // Validate Login User
  async validateLoginUser(loginDto: loginDto, res: Response) {
    try {

      const user = await this.staffService.findWithUserNm({
        userNm: loginDto.userNm,
      });

      if (!user) {
        return res.status(401).json({ data: null, message: 'User Not exist' });
      }

      if (
        config.checkHospitalDomain === 'Y' &&
        user?.company_mst?.domain &&
        user?.company_mst?.domain !== loginDto?.domain
      ) {
        return res.status(401).json({
          data: null,
          message: 'Your reqested Domain is invalid',
        });
      }

      if (!user.is_login_access) {
        return res.status(401).json({
          data: null,
          message:
            "You haven't login permission so you do login to this application",
        });
      }

      if (!user.is_active) {
        return res.status(401).json({
          data: null,
          message: 'you are currently inactive. please content to system admin',
        });
      }

      // Check User Lock Status for 30 min.
      if (user.is_lock) {
        const uploadTm = user.lock_tm;
        uploadTm.setMinutes(uploadTm.getMinutes() + 30)

        if (uploadTm > this.helperService.getUTCTime(new Date().toISOString())) {
          // Get duration Current time and uplock time. 
          const diffMs = Math.abs(uploadTm.getTime() - this.helperService.getUTCTime(new Date().toISOString()).getTime()); // difference in milliseconds
          const getDurationMin = Math.floor(diffMs / (1000 * 60));
          return this.helperService.response(res, 410, false, msg.tempUserLock.replace("<DURATION>", getDurationMin.toString()), null);
        }
      }

      if (user && (await bcrypt.compare(loginDto.password, user.password))) {
        const { password, ...result } = user;
        return result;
      }

      return res.status(401).json({
        data: null,
        message: 'Invalid User',
      });
    } catch (error) {
      this.logger.log(error.message, error.stack, 'ValidateLoginUser');
      this.helperService.exceptionHandler(error);
    }
  }

  async login(
    @Body() loginDto: loginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {

      const loginDtl: any = await this.validateLoginUser(loginDto, res);

      const generateSessionId = uuid();


      if (loginDtl.company_mst.two_fa) {
        if (loginDtl.two_fac_type === 'OTP') {
          // Use Two Factor authentication via OTP
          const otpCode = this.helperService.generateRendomOTP();

          const tempTkn = await this.generateTknService.tempTkn(req, generateSessionId, loginDtl, otpCode.toString(), 'OTP_verification');

          await this.prisma.staff_mst.update({
            where: {
              id: loginDtl.id,
            },
            data: {
              otp_cd: otpCode,
              otp_atmp: 0,
              is_lock: false,
              lock_tm: null,
              otp_tm: this.helperService.getUTCTime(new Date().toISOString()),
            },
          });


          sendMail({ to: "yogeshsuthar1901@gmail.com", subject: "Login OTP Verification", html: sendOTPTemplate.replace("<OTP_CD>", otpCode.toString()), companyDtl: loginDtl.company });

          const resposne = {
            staffId: loginDtl.id,
            hostpitalId: loginDtl.comp_id,
            ...(loginDtl.branch_id && { branchId: loginDtl.branch_id }),
            userNm: loginDtl.user_nm,
            emailId: loginDtl.email_id,
            mobileNo: loginDtl.mobile_no,
            isTwoFac: loginDtl.company_mst.two_fa,
            twoFacType: loginDtl.two_fac_type,
            jwtToken: {
              accessTkn: tempTkn,
            },
          };

          return this.helperService.response(
            res,
            200,
            true,
            `OTP sent on you registered email Id ${loginDtl.email_id}`,
            resposne,
          );
        } else if (loginDtl.two_fac_type === 'GAUTH') {
          if (!loginDtl.is_auth_status) {

            const { gAuthQrCode, key } = await this.helperService.generateGauthQrCode(loginDtl);

            const tempTkn = await this.generateTknService.tempTkn(req, generateSessionId, loginDtl, key, 'generate_two_factor_auth_token');

            await this.prisma.staff_mst.update({
              where: {
                user_nm: loginDto.userNm,
              },
              data: {
                temp_gauth_key: key,
              },
            });

            const resposne = {
              staffId: loginDtl.id,
              hostpitalId: loginDtl.comp_id,
              ...(loginDtl?.branch_id && { branchId: loginDtl?.branch_id }),
              userNm: loginDtl.user_nm,
              emailId: loginDtl.email_id,
              mobileNo: loginDtl.mobile_no,
              isTwoFac: loginDtl.company_mst.two_fa,
              authStatus: loginDtl.is_auth_status,
              twoFacType: loginDtl.two_fac_type,
              gAuthData: {
                qrCode: gAuthQrCode,
                key: key,
              },
              jwtToken: {
                accessTkn: tempTkn,
              },
            };

            return this.helperService.response(res, 200, true, `Scan QR code and enter google Authenticator OTP.`, resposne);
          } else {

            const tempTkn = await this.generateTknService.tempTkn(req, generateSessionId, loginDtl, loginDtl.gauth_key, 'two_factor_auth_token',);

            const resposne = {
              staffId: loginDtl.id,
              hostpitalId: loginDtl.comp_id,
              ...(loginDtl?.branch_id && { branchId: loginDtl?.branch_id }),
              userNm: loginDtl.user_nm,
              emailId: loginDtl.email_id,
              mobileNo: loginDtl.mobile_no,
              isTwoFac: loginDtl.company_mst.two_fa,
              authStatus: loginDtl.is_auth_status,
              twoFacType: loginDtl.two_fac_type,
              gAuthData: null,
              jwtToken: {
                accessTkn: tempTkn,
              },
            };

            return this.helperService.response(res, 200, true, `Scan QR code and enter google Authenticator OTP.`, resposne);
          }
        }
      }

      const { accessTkn, accessTknExpire } = await this.generateTknService.accessToken(loginDtl, generateSessionId, req);

      const { refreshTkn, refreshTknExpire } = await this.generateTknService.refreshToken(loginDtl, generateSessionId, req);

      await this.prisma.staff_mst.update({
        where: {
          user_nm: loginDto.userNm,
        },
        data: {
          sessionId: generateSessionId,
          last_login_tm: this.helperService.getUTCTime(new Date().toISOString()),
        },
      });

      const branchDtl = await this.prisma.branch_mst.findUnique({
        where: {
          id: loginDtl.branch_id
        }
      });

      const resposne = {
        staffId: loginDtl.id,
        hostpitalId: loginDtl.comp_id,
        userNm: loginDtl.user_nm,
        role: loginDtl.role,
        fullNm: loginDtl.full_nm,
        emailId: loginDtl.email_id,
        mobileNo: loginDtl.mobile_no,
        gender: loginDtl.gender,
        department: loginDtl?.department_mst?.depart_nm,
        isActive: loginDtl.is_active,
        profile_img: loginDtl.profile_img,
        twoFactorType: loginDtl.two_fac_type,
        lastPasswordChng: loginDtl.last_pass_chng,
        lastLoginTm: loginDtl.last_login_tm,
        temproryPassword: loginDtl.temp_pass,
        hospitalCd: loginDtl.company_mst.comp_cd,
        hospitalNm: loginDtl.company_mst.comp_nm,
        hospitalType:
          (loginDtl.company_mst.comp_type === 'P' && 'Private') ||
          (loginDtl.company_mst.comp_type === 'G' && 'Government') ||
          (loginDtl.company_mst.comp_type === 'T' && 'Trust'),
        hospitalMobileNo: loginDtl.company_mst.mobile_no,
        hospitalEmailId: loginDtl.company_mst.email_id,
        hospitalAddress1: loginDtl.company_mst.address_1,
        hospitalAddress2: loginDtl.company_mst.address_2,
        hospitalCity: loginDtl.company_mst.city,
        hospitalState: loginDtl.company_mst.state,
        hospitalCountry: loginDtl.company_mst.country,
        hospitalPinCd: loginDtl.company_mst.pin_cd,
        branchData: {
          branchId: branchDtl.id,
          branchCd: branchDtl.branch_cd,
          branchNm: branchDtl.branch_nm,
          branchAddress: branchDtl.address,
          branchCity: branchDtl.city,
          branchState: branchDtl.state,
          branchCountry: branchDtl.country,
        },
        jwtToken: {
          accessTkn: accessTkn,
          accessTknExpire: accessTknExpire,
          refreshTkn: refreshTkn,
          refreshTknExpire: refreshTknExpire
        },
      };

      return this.helperService.response(res, 200, true, `Login successfully.`, resposne);

    } catch (error) {
      this.logger.log(error.message, error.stack, 'Login User Service');
      this.helperService.exceptionHandler(error);
    }
  }


  // Verify GAuth OTP on Active time
  async verifyGAuthOtpService(verifyGAuthOtpDto: verifyGAuthOtpDto, req: Request, res: Response) {
    try {

      const tknPayload: any = req.user;

      const isVerified = speakeasy.totp.verify({
        secret: tknPayload?.tempSecret,
        encoding: 'base32',
        token: verifyGAuthOtpDto.gAuthCode,
        window: 1,
      });

      if (!isVerified) {
        // this.increaseInvalidOTPAttemp(findUser, res);
        return this.helperService.response(res, 200, false, msg.invaliGFAuthCode, null)
      };

      await this.prisma.staff_mst.update({
        where: {
          id: verifyGAuthOtpDto.userId,
          comp_id: verifyGAuthOtpDto.compId,
          branch_id: verifyGAuthOtpDto.branchId,
        },
        data: {
          gauth_key: tknPayload?.tempSecret,
          temp_gauth_key: null,
          is_auth_status: true
        },
      });

      return this.helperService.response(res, 200, true, "Google Authentication is Activate", null);
    } catch (error) {
      this.logger.log(error.message, error.stack, 'Activate Google Authentication Service');
      this.helperService.exceptionHandler(error);
    }
  }

  async validateOtpService(verifyOtpDto: verifyOtpDto, req: Request, res: Response) {
    try {
      const { tknPayload, loginUser }: any = req.user;

      if (tknPayload?.purpose !== "two_factor_auth_token" && tknPayload?.purpose !== "OTP_verification") {
        return this.helperService.response(res, 403, false, msg.invalidTkn, null);
      }


      if (tknPayload?.purpose === "two_factor_auth_token") {
        const isVerified = speakeasy.totp.verify({
          secret: tknPayload?.tempSecret,
          encoding: 'base32',
          token: verifyOtpDto.otpCode,
          window: 1,
        });

        if (!isVerified) {
          this.increaseInvalidOTPAttemp(loginUser, res);
          return this.helperService.response(res, 400, false, msg.invalidGAuthOTP, null);
        };
      } else {
        const otpExpireTm = loginUser.otp_tm;
        otpExpireTm.setMinutes(otpExpireTm.getMinutes() + config.otpExpireTm)

        if (otpExpireTm <= this.helperService.getUTCTime(new Date().toISOString())) {
          return this.helperService.response(res, 400, false, msg.otpExpire, null);
        }

        if (verifyOtpDto.otpCode !== loginUser?.otp_cd.toString()) {
          this.increaseInvalidOTPAttemp(loginUser, res);
          return this.helperService.response(res, 400, false, msg.invalidOTP, null);
        }
      }

      const generateSessionId = uuid();

      const { accessTkn, accessTknExpire } = await this.generateTknService.accessToken(loginUser, generateSessionId, req);

      const { refreshTkn, refreshTknExpire } = await this.generateTknService.refreshToken(loginUser, generateSessionId, req);

      await this.prisma.staff_mst.update({
        where: {
          id: verifyOtpDto.userId,
          comp_id: verifyOtpDto.compId,
        },
        data: {
          sessionId: generateSessionId,
          otp_cd: 0,
          last_login_tm: this.helperService.getUTCTime(new Date().toISOString()),
        },
      });

      const branchDtl = await this.prisma.branch_mst.findUnique({
        where: {
          id: verifyOtpDto.branchId
        }
      });

      const resposne = {
        staffId: loginUser.id,
        hostpitalId: loginUser.comp_id,
        userNm: loginUser.user_nm,
        role: loginUser.role,
        fullNm: loginUser.full_nm,
        emailId: loginUser.email_id,
        mobileNo: loginUser.mobile_no,
        gender: loginUser.gender,
        department: loginUser.department_mst.depart_nm,
        isActive: loginUser.is_active,
        profile_img: loginUser.profile_img,
        twoFactorType: loginUser.two_fac_type,
        lastPasswordChng: loginUser.last_pass_chng,
        lastLoginTm: loginUser.last_login_tm,
        temproryPassword: loginUser.temp_pass,
        hospitalCd: loginUser.company_mst.comp_cd,
        hospitalNm: loginUser.company_mst.comp_nm,
        hospitalType:
          (loginUser.company_mst.comp_type === 'P' && 'Private') ||
          (loginUser.company_mst.comp_type === 'G' && 'Government') ||
          (loginUser.company_mst.comp_type === 'T' && 'Trust'),
        hospitalMobileNo: loginUser.company_mst.mobile_no,
        hospitalEmailId: loginUser.company_mst.email_id,
        hospitalAddress1: loginUser.company_mst.address_1,
        hospitalAddress2: loginUser.company_mst.address_2,
        hospitalCity: loginUser.company_mst.city,
        hospitalState: loginUser.company_mst.state,
        hospitalCountry: loginUser.company_mst.country,
        hospitalPinCd: loginUser.company_mst.pin_cd,
        branchData: {
          branchId: branchDtl.id,
          branchCd: branchDtl.branch_cd,
          branchNm: branchDtl.branch_nm,
          branchAddress: branchDtl.address,
          branchCity: branchDtl.city,
          branchState: branchDtl.state,
          branchCountry: branchDtl.country,
        },
        jwtToken: {
          accessTkn: accessTkn,
          accessTknExpire: accessTknExpire,
          refreshTkn: refreshTkn,
          refreshTknExpire: refreshTknExpire
        },
      };

      return this.helperService.response(res, 200, true, msg.otpVerifySuccess, resposne);
    } catch (error) {
      this.logger.log(error.message, error.stack, 'Validate OTP Service');
      this.helperService.exceptionHandler(error);
    }
  }


  // Logout Service
  async logoutService(logout: logoutOutDto, res: Response) {
    try {
      await this.prisma.staff_mst.update({
        where: {
          id: logout.userId,
          comp_id: logout.compId,
          branch_id: logout.branchId,
        },
        data: {
          sessionId: null,
        },
      });

      return this.helperService.response(res, 200, true, msg.logoutSuccess, null);
    } catch (error) {
      this.logger.log(error.message, error.stack, 'Logout Service');
      this.helperService.exceptionHandler(error);
    }
  }


  async refreshTokanService(refreshTokenDto: refreshTokenDto, req: Request, res: Response) {
    try {

      const requestUser: any = req.user;

      const decodedRefreshTkn = this.jwtService.decode(refreshTokenDto.refreskTkn);

      if (requestUser?.sessionId !== decodedRefreshTkn?.sessionId || requestUser?.userId !== decodedRefreshTkn?.userId || requestUser?.compId !== decodedRefreshTkn?.compId || requestUser?.branchId !== decodedRefreshTkn?.branchId || requestUser?.role !== decodedRefreshTkn?.role) {

        await this.prisma.staff_mst.update({
          where: {
            id: requestUser?.userId,
            comp_id: requestUser?.compId,
            branch_id: requestUser?.branchId
          },
          data: {
            sessionId: null,
          },
        });

        return this.helperService.response(res, 403, false, msg.invalidExpireTkn, null);
      }

      const generateSessionId = uuid();

      const { accessTkn, accessTknExpire } = await this.generateTknService.accessToken(requestUser, generateSessionId, req);

      const { refreshTkn, refreshTknExpire } = await this.generateTknService.refreshToken(requestUser, generateSessionId, req);

      await this.prisma.staff_mst.update({
        where: {
          id: requestUser?.userId,
          comp_id: requestUser?.compId,
          branch_id: requestUser?.branchId
        },
        data: {
          sessionId: generateSessionId,
        },
      });

      const jwtToken = {
        accessTkn: accessTkn,
        accessTknExpire: accessTknExpire,
        refreshTkn: refreshTkn,
        refreshTknExpire: refreshTknExpire
      };

      return this.helperService.response(res, 200, true, msg.refreshTknSuccess, jwtToken);
    } catch (error) {
      this.logger.log(error.message, error.stack, 'Refresh Token Service');
      this.helperService.exceptionHandler(error);
    }
  }


  async increaseInvalidOTPAttemp(findData: any, res: Response) {
    try {

      if (findData?.otp_atmp >= 3) {
        await this.prisma.staff_mst.update({
          where: {
            user_nm: findData.user_nm,
            id: findData.id,
            comp_id: findData.comp_id,
            branch_id: findData.branch_id,
          },
          data: {
            is_lock: true,
            lock_tm: this.helperService.getUTCTime(new Date().toISOString())
          },
        });
        return this.helperService.response(res, 403, false, msg.invalidMultipleAtp, null);
      } else {
        await this.prisma.staff_mst.update({
          where: {
            user_nm: findData.user_nm,
            id: findData.id,
            comp_id: findData.comp_id,
            branch_id: findData.branch_id,
          },
          data: {
            otp_atmp: findData.otp_atmp + 1,
          },
        });
      }
    } catch (error) {
      this.logger.log(error.message, error.stack, 'increase invalid OTP attemp');
      this.helperService.exceptionHandler(error);
    }
  }
}
