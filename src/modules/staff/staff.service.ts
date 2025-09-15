import { Inject, Injectable, Logger, LoggerService, UnauthorizedException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { DatabaseService } from '../../database/database.service';
import { HelperService } from 'src/common/utils/helper/helper.service';
import { Response } from 'express';
import config from "../../config/config";
import * as msg from "../../common/utils/helper/message";
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class StaffService {

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private prisma: DatabaseService,
    private readonly helperService: HelperService,
  ) { }


  // Validate Login User
  async validateReqestedUser(loginDto: { userId: number, compId: number, branchId: number, domain: string | null }, payload?: any) {
    try {

      const user = await this.findWithId(loginDto);

      if (!user) {
        throw (
          new UnauthorizedException({
            status: 403,
            success: false,
            message: msg.unauthorizedUser,
            data: null
          })
        );
      }

      if (payload && payload.sessionId !== user.sessionId) {
        throw (
          new UnauthorizedException({
            status: 403,
            success: false,
            message: msg.invalidTkn,
            data: null
          })
        );
      }

      if (
        config.checkHospitalDomain === 'Y' &&
        user?.company?.domain &&
        user?.company?.domain !== loginDto?.domain
      ) {
        throw (
          new UnauthorizedException({
            status: 403,
            success: false,
            message: msg.invalidDomain,
            data: null
          })
        );
      }

      if (!user.is_login_access) {
        throw (
          new UnauthorizedException({
            status: 403,
            success: false,
            message: msg.noHaveLoginPermission,
            data: null
          })
        );
      }

      if (!user.is_active) {
        throw (
          new UnauthorizedException({
            status: 403,
            success: false,
            message: msg.inactiveUserAcct,
            data: null
          })
        );
      }

      // Check User Lock Status for 30 min.
      if (user.is_lock) {
        const uploadTm = user.lock_tm;
        uploadTm.setMinutes(uploadTm.getMinutes() + 30)

        if (uploadTm > this.helperService.getUTCTime(new Date().toISOString())) {
          // Get duration Current time and uplock time. 
          const diffMs = Math.abs(uploadTm.getTime() - this.helperService.getUTCTime(new Date().toISOString()).getTime()); // difference in milliseconds
          const getDurationMin = Math.floor(diffMs / (1000 * 60));

          throw (
            new UnauthorizedException({
              status: 403,
              success: false,
              message: msg.tempUserLock.replace("<DURATION>", getDurationMin.toString()),
              data: null
            })
          );
        }
      }

      const { password, ...result } = user;
      return result;
    } catch (error) {
      this.logger.log(error.message, error.stack, 'Validate to requested user');
      this.helperService.exceptionHandler(error);
    }
  }

  create(createStaffDto: CreateStaffDto) {
    return 'This action adds a new staff';
  }

  findAll() {
    return `This action returns all staff`;
  }

  async findWithUserNm({ userNm }: { userNm?: string }) {

    const findStaff = await this.prisma.staff_mst.findFirst({
      where: {
        OR: [
          { user_nm: userNm },
          { email_id: userNm },
          { mobile_no: userNm },
        ],
      },
      include: { company_mst: true, department_mst: true },
    });


    return findStaff;
  }

  async findWithId(userReq: any) {
    const findStaff: any = await this.prisma.staff_mst.findFirst({
      where: {
        AND: [
          { id: userReq.userId },
          { comp_id: userReq.compId },
          { branch_id: userReq.branchId },
        ],
      },
      include: { company_mst: true, department_mst: true },
    })

    const branchDtl = await this.prisma.branch_mst.findUnique({
      where: {
        id: findStaff.branch_id
      }
    });

    const branchData = {
      branchId: branchDtl.id,
      branchCd: branchDtl.branch_cd,
      branchNm: branchDtl.branch_nm,
      branchAddress: branchDtl.address,
      branchCity: branchDtl.city,
      branchState: branchDtl.state,
      branchCountry: branchDtl.country,
    };

    return { ...findStaff, branch: branchData };
  }

  update(id: number, updateStaffDto: UpdateStaffDto) {
    return `This action updates a #${id} staff`;
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }


}
