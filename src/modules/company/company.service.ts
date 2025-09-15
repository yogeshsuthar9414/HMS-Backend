import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DatabaseService } from 'src/database/database.service';
import { HelperService } from '../../common/utils/helper/helper.service';
import { addCompanyDto } from './dto/addCompany.dto';
import { Request, Response } from 'express';
import { sendMail } from 'src/common/email/email.service';
import { sendOTPTemplate } from 'src/common/email/templates/email.content';
import { CommonServices } from 'src/common/services/common.service';
import { getCompanyDtlProps, getCompanyProps } from 'src/types/company.type';
import { updateCompanyStatusDto } from './dto/updateCompanyStatus.dto';
import * as msg from "../../common/utils/helper/message";

@Injectable()
export class CompanyService {

    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private helperService: HelperService,
        private prisma: DatabaseService,
        private commonService: CommonServices
    ) { }

    async addCompanyService(addCompanyDto: addCompanyDto, req: Request, res: Response) {
        try {
            const { loginUser }: any = req.user;

            if (loginUser?.company_mst?.comp_cd !== "999999") {
                return this.helperService.response(res, 401, false, "Your hosiptal have not permissioned to add new hospital.", null);
            }

            const { userId, compId, branchId, domain, ...companyPayload } = addCompanyDto;

            // Find Company Existing company with Company Code and Domain
            const findCompany = await this.prisma.company_mst.findMany({
                where: {
                    OR: [
                        {
                            comp_cd: companyPayload.hospitalId,
                        },
                        {
                            domain: companyPayload.hospitalDomain,
                        }
                    ]
                }
            });

            if (findCompany.length > 0) {
                return this.helperService.response(res, 400, false, "This company is already exist so please try with different domain and hospital id", null);
            }

            await this.prisma.$transaction(async (db) => {
                // Create new Company
                const company = await db.company_mst.create({
                    data: {
                        comp_cd: companyPayload.hospitalId,
                        comp_nm: companyPayload.hospitalNm,
                        domain: companyPayload.hospitalDomain,
                        comp_type: companyPayload.hospitalType,
                        mobile_no: companyPayload.mobileNo,
                        email_id: companyPayload.emailId,
                        address_1: companyPayload.address1,
                        address_2: companyPayload.address2,
                        city: companyPayload.city,
                        state: companyPayload.state,
                        country: companyPayload.country,
                        pin_cd: companyPayload.pinCd,
                        two_fa: companyPayload.isAllowTwoFactorAuth,
                        logo: companyPayload.logo,
                        fav_icon: companyPayload.favIcon,
                        logo_width: companyPayload.logoWidth,
                        logo_height: companyPayload.logoHeight,
                        is_sms: companyPayload.isSms,
                        sms_method: companyPayload.smsMethod,
                        sms_url: companyPayload.smsUrl,
                        is_email: companyPayload.isSMTP,
                        smtp_host: companyPayload.smtpHost,
                        smtp_port: companyPayload.smtpPort,
                        smtp_tls: companyPayload.smtpTls,
                        smtp_usernm: companyPayload.smtpUsername,
                        smtp_password: companyPayload.smtpPassword,
                        smtp_from_email: companyPayload.smtpFrom,
                        entry_by: userId,
                        entry_dt: this.helperService.getUTCTime(new Date().toISOString()),
                        is_active: true,
                    }
                });

                var branch = null

                if (companyPayload.isAllowMultiBranch) {
                    // Create Branch
                    branch = await db.branch_mst.create({
                        data: {
                            comp_id: company.id,
                            branch_cd: "000001",
                            branch_nm: "Main Branch",
                            address: companyPayload.address1,
                            city: companyPayload.city,
                            state: companyPayload.state,
                            country: companyPayload.country,
                            pin_cd: companyPayload.pinCd,
                            mobile_no: companyPayload.mobileNo,
                            email_id: companyPayload.emailId,
                            lat: companyPayload.latitude,
                            long: companyPayload.longitude,
                            is_active: true,
                            entry_dt: this.helperService.getUTCTime(new Date().toISOString()),
                            entry_by: userId,
                        }
                    });
                }

                // Create General Department for admin user.
                const department = await db.department_mst.create({
                    data: {
                        depart_nm: "General",
                        company_mst: {
                            connect: { id: company.id },
                        },
                    }
                });

                // Create Admin User For Company
                await db.staff_mst.create({
                    data: {
                        branch_id: branch?.id || null,
                        user_nm: "Admin",
                        password: await this.helperService.bcyptPassword("admin"),
                        role: "ADM",
                        full_nm: "",
                        email_id: companyPayload.emailId,
                        mobile_no: companyPayload.mobileNo,
                        join_dt: this.helperService.getUTCTime(new Date().toISOString()),
                        is_active: true,
                        is_login_access: true,
                        gender: "M",
                        entry_by: userId,
                        entry_dt: this.helperService.getUTCTime(new Date().toISOString()),
                        company_mst: {
                            connect: { id: company.id },
                        },
                        department_mst: {
                            connect: { id: department.id },
                        },
                    }
                });
            })

            sendMail({ to: companyPayload.emailId, subject: "Your Hospital Registered Successfully", html: sendOTPTemplate, companyDtl: loginUser?.company_mst });

            return this.helperService.response(res, 200, true, "Company created successfully.", null);
        } catch (error) {
            this.logger.log(error.message, error.stack, 'ValidateLoginUser');
            this.helperService.exceptionHandler(error);
        }
    }


    async getClientCdService(req: Request, res: Response) {
        try {

            const { loginUser }: any = req.user;

            if (loginUser?.company_mst?.comp_cd !== "999999") {
                return this.helperService.response(res, 401, false, "Your hosiptal have not permissioned to add new hospital.", null);
            }

            const largestClientCode: { comp_cd: string }[] = await this.prisma.company_mst.findMany({
                where: {
                    comp_cd: {
                        not: "999999",
                    },
                },
                orderBy: { comp_cd: 'desc' }, // get the max one
                select: { comp_cd: true },
            });

            let nextCode = "000001";

            if (largestClientCode) {
                const num = parseInt(largestClientCode[0].comp_cd) + 1;

                // Check if reached limit
                if (num > 999999) {
                    throw new Error("Client code limit reached");
                }

                // Keep same length
                nextCode = num.toString().padStart(largestClientCode[0].comp_cd.length, '0');
            }

            return this.helperService.response(res, 200, true, "Get Client Code successfully.", { clientCd: nextCode });
        } catch (error) {
            this.logger.log(error.message, error.stack, 'get_hospitals_code');
            this.helperService.exceptionHandler(error);
        }
    }

    async getClients(req: Request, res: Response) {
        try {

            const { loginUser }: any = req.user;

            if (loginUser?.company_mst?.comp_cd !== "999999") {
                return this.helperService.response(res, 401, false, "Your hosiptal have not permissioned to add new hospital.", null);
            }

            const getClientList: getCompanyProps[] = await this.prisma.company_mst.findMany({
                orderBy: { comp_nm: "asc" },
                select: {
                    id: true,
                    comp_cd: true,
                    comp_nm: true,
                    comp_type: true,
                    domain: true,
                    mobile_no: true,
                    email_id: true,
                    address_1: true,
                    city: true,
                    state: true,
                    country: true,
                    two_fa: true,
                    pin_cd: true,
                    is_active: true,
                    entry_by: true,
                    entry_dt: true,
                    update_by: true,
                    update_dt: true,
                }
            });

            if (getClientList.length === 0) {
                return this.helperService.response(res, 404, false, msg.noDataFound, null);
            }

            const updateColumnsNm = await Promise.all(getClientList.map(async (d) => ({
                tranCd: d.id,
                companyCd: d.comp_cd,
                companyNm: d.comp_nm,
                companyType: d.comp_type,
                domain: d.domain,
                mobileNo: d.mobile_no,
                emailId: d.email_id,
                address: d.address_1,
                city: d.city,
                state: d.state,
                country: d.country,
                pinCd: d.pin_cd,
                twoFaStatus: d.two_fa,
                isActive: d.is_active,
                entryBy: d.entry_by ? await this.commonService.entryByUserNm(d.entry_by, "get_hospitals") : null,
                entryDt: d.entry_dt ? this.helperService.dateFormat(d.entry_dt) : null,
                updateBy: d.update_by ? await this.commonService.entryByUserNm(d.update_by, "get_hospitals") : null,
                updateDt: d.update_dt ? this.helperService.dateFormat(d.update_dt) : null
            })));


            return this.helperService.response(res, 200, true, "Success", updateColumnsNm);
        } catch (error) {
            this.logger.log(error.message, error.stack, 'get_hospitals');
            this.helperService.exceptionHandler(error);
        }
    }

    async updateCompanyStatusService(reqBody: updateCompanyStatusDto, req: Request, res: Response) {
        try {

            const { loginUser }: any = req.user;

            if (reqBody.actionType === "S") {
                if (loginUser?.company_mst?.comp_cd !== "999999") {
                    return this.helperService.response(res, 401, false, "Your hosiptal have not permissioned to add new hospital.", null);
                }
            }

            const currentStatus: { is_active?: boolean, two_fa?: boolean } = await this.prisma.company_mst.findUnique({
                where: {
                    id: reqBody.tranId
                },
                select: {
                    ...(reqBody.actionType === "S" && { is_active: true }),
                    ...(reqBody.actionType === "T" && { two_fa: true })
                },
            });

            if (!currentStatus) {
                return this.helperService.response(res, 404, false, msg.noDataFound, null);
            }

            const updateVal = await this.prisma.company_mst.update({
                where: {
                    id: reqBody.tranId
                },
                data: {
                    ...(reqBody.actionType === "S" && { is_active: !currentStatus.is_active }),
                    ...(reqBody.actionType === "T" && { two_fa: !currentStatus.two_fa }),
                }
            });

            const resMessageOfStatus = "Company status is successfully" + updateVal.is_active ? "active" : "inactive";
            const resMessageOsTwofa = "Company two factor authentication is successfully" + updateVal.two_fa ? "active" : "inactive";

            return this.helperService.response(res, 200, true, (reqBody.actionType === "S" && resMessageOfStatus) || (reqBody.actionType === "T" && resMessageOsTwofa), null);
        } catch (error) {
            console.log("error", error);
            this.logger.log(error.message, error.stack, 'update_company_status');
            this.helperService.exceptionHandler(error);
        }
    }

    async getCompanyDtlServiecs(reqBody: updateCompanyStatusDto, res: Response) {
        try {
            const compDtl: getCompanyDtlProps = await this.prisma.company_mst.findUnique({
                where: {
                    id: reqBody.tranId
                },
                select: {
                    id: true,
                    comp_cd: true,
                    comp_nm: true,
                    comp_type: true,
                    domain: true,
                    mobile_no: true,
                    email_id: true,
                    address_1: true,
                    address_2: true,
                    city: true,
                    state: true,
                    country: true,
                    two_fa: true,
                    pin_cd: true,
                    is_active: true,
                    logo: true,
                    logo_height: true,
                    logo_width: true,
                    fav_icon: true,
                    is_sms: true,
                    sms_method: true,
                    sms_url: true,
                    is_email: true,
                    smtp_host: true,
                    smtp_port: true,
                    smtp_tls: true,
                    smtp_usernm: true,
                    smtp_password: true,
                    smtp_from_email: true,
                    entry_by: true,
                    entry_dt: true,
                    update_by: true,
                    update_dt: true,
                },
            });

            if (!compDtl) {
                return this.helperService.response(res, 404, false, msg.noDataFound, null);
            }

            const updateObjNames = {
                tranCd: compDtl.id,
                companyCd: compDtl.comp_cd,
                companyNm: compDtl.comp_nm,
                companyType: compDtl.comp_type,
                domain: compDtl.domain,
                mobileNo: compDtl.mobile_no,
                emailId: compDtl.email_id,
                address: compDtl.address_1,
                city: compDtl.city,
                state: compDtl.state,
                country: compDtl.country,
                pinCd: compDtl.pin_cd,
                twoFaStatus: compDtl.two_fa,
                isActive: compDtl.is_active,
                logo: compDtl.logo,
                logoHeight: compDtl.logo_height,
                logoWidth: compDtl.logo_width,
                favIcon: compDtl.fav_icon,
                isSms: compDtl.is_sms,
                smsMethod: compDtl.sms_method,
                smsUrl: compDtl.sms_url,
                isEmail: compDtl.is_email,
                smtpHost: compDtl.smtp_host,
                smtpPort: compDtl.smtp_port,
                smtpTls: compDtl.smtp_tls,
                smtpUsernm: compDtl.smtp_usernm,
                smtpPassword: compDtl.smtp_usernm,
                smtp_from_email: compDtl.smtp_from_email,
                entryBy: compDtl.entry_by ? await this.commonService.entryByUserNm(compDtl.entry_by, "get_hospitals") : null,
                entryDt: compDtl.entry_dt ? this.helperService.dateFormat(compDtl.entry_dt) : null,
                updateBy: compDtl.update_by ? await this.commonService.entryByUserNm(compDtl.update_by, "get_hospitals") : null,
                updateDt: compDtl.update_dt ? this.helperService.dateFormat(compDtl.update_dt) : null
            }

            return this.helperService.response(res, 200, true, `Success`, updateObjNames);
        } catch (error) {
            console.log("error", error);
            this.logger.log(error.message, error.stack, 'get_company_details');
            this.helperService.exceptionHandler(error);
        }
    }
}
