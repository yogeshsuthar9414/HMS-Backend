import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { addPlanDto, editPlanDto } from './dto/plan.dto';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HelperService } from 'src/common/utils/helper/helper.service';
import { DatabaseService } from 'src/database/database.service';
import { CommonServices } from 'src/common/services/common.service';

import * as msg from "../../common/utils/helper/message";
import { sanitize } from 'class-sanitizer';
import { commonDto } from 'src/common/dto/common.dto';
import { getPlanList } from 'src/types/plan.type';

@Injectable()
export class PlanService {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private helperService: HelperService,
        private prisma: DatabaseService,
        private commonService: CommonServices
    ) { }

    async addPlanService(addPlanDto: addPlanDto, req: Request, res: Response) {
        try {

            const planNm: any = sanitize(addPlanDto.planNm)
            const price: any = sanitize(addPlanDto.price)
            const validateType: any = sanitize(addPlanDto.validateType)
            const validateFor: any = sanitize(addPlanDto.validateFor)
            const features: any = sanitize(addPlanDto.features)
            const description: any = sanitize(addPlanDto.description)
            const planModules: any = sanitize(addPlanDto.planModules)
            const userId: any = sanitize(addPlanDto.userId)

            if (validateType === "D" && validateFor >= 30) {
                return this.helperService.response(res, 401, false, "You don't create more than 30 days or select months", null);
            } else if (validateType === "M" && validateFor >= 18) {
                return this.helperService.response(res, 401, false, "You don't create more than 18 months", null);
            }

            const checkExist = await this.prisma.plan_mst.findMany({
                where: {
                    plan_nm: planNm,
                }
            })

            if (checkExist.length > 0) {
                return this.helperService.response(res, 404, false, "Plan with same name already exists", null);
            }

            await this.prisma.$transaction(async (db) => {
                const plan = await db.plan_mst.create({
                    data: {
                        plan_nm: planNm,
                        price: price,
                        validate_type: validateType,
                        validate_for: validateFor,
                        features: features,
                        description: description,
                        entry_by: userId,
                        entry_dt: this.helperService.getUTCTime(new Date().toISOString())
                    }
                });

                const addablePlanModule = planModules.filter((d: { moduleId: number, isExist: boolean, isDelete: boolean }) => !d.isDelete && !d.isExist).map((m: { moduleId: number, isExist: boolean, isDelete: boolean }) => ({ module_id: m.moduleId, plan_id: plan.id }));

                // Multiple Plan module insert in plan module detail table
                await db.plan_module_dtl.createMany({
                    data: addablePlanModule,
                    skipDuplicates: true,
                });
            })

            return this.helperService.response(res, 200, false, "Success", null);
        } catch (error) {
            this.logger.log(error.message, error.stack, 'add_plan');
            this.helperService.exceptionHandler(error);
        }
    }

    async editPlanService(tranCd: number, editPlanDto: editPlanDto, req: Request, res: Response) {
        try {

            const planId: any = sanitize(tranCd)
            const planNm: any = sanitize(editPlanDto.planNm)
            const price: any = sanitize(editPlanDto.price)
            const validateType: any = sanitize(editPlanDto.validateType)
            const validateFor: any = sanitize(editPlanDto.validateFor)
            const features: any = sanitize(editPlanDto.features)
            const description: any = sanitize(editPlanDto.description)
            const planModules: any = sanitize(editPlanDto.planModules)
            const userId: any = sanitize(editPlanDto.userId)

            const checkExist = await this.prisma.plan_mst.findUnique({
                where: {
                    id: Number(planId),
                }
            })

            if (!checkExist) {
                return this.helperService.response(res, 404, false, "No data found", null);
            }

            if (validateType === "D" && validateFor >= 30) {
                return this.helperService.response(res, 401, false, "You don't create more than 30 days or select months", null);
            } else if (validateType === "M" && validateFor >= 18) {
                return this.helperService.response(res, 401, false, "You don't create more than 18 months", null);
            }

            await this.prisma.$transaction(async (db) => {
                const plan = await db.plan_mst.update({
                    where: {
                        id: Number(planId)
                    },
                    data: {
                        plan_nm: planNm,
                        price: price,
                        validate_type: validateType,
                        validate_for: validateFor,
                        features: features,
                        description: description,
                        entry_by: userId,
                        entry_dt: this.helperService.getUTCTime(new Date().toISOString())
                    }
                });

                const addablePlanModule = planModules.filter((d: { moduleId: number, isExist: boolean, isDelete: boolean }) => !d.isDelete && !d.isExist).map((m: { moduleId: number, isExist: boolean, isDelete: boolean }) => ({ module_id: m.moduleId, plan_id: plan.id }));
                const deleteblePlanModule = planModules.filter((d: { moduleId: number, isExist: boolean, isDelete: boolean }) => d.isDelete && d.isExist);

                // Multiple Plan module insert in plan module detail table
                await db.plan_module_dtl.createMany({
                    data: addablePlanModule,
                    skipDuplicates: true,
                });

                for (let i = 0; i < deleteblePlanModule.length; i++) {
                    const plansModules = await db.plan_module_dtl.findFirst({
                        where: {
                            plan_id: plan.id,
                            module_id: deleteblePlanModule[i].moduleId
                        }
                    });

                    await db.plan_module_dtl.delete({
                        where: {
                            id: plansModules.id,
                        }
                    });
                }
            })

            return this.helperService.response(res, 200, false, "Success", null);
        } catch (error) {
            this.logger.log(error.message, error.stack, 'update_plan');
            this.helperService.exceptionHandler(error);
        }
    }

    async deletePlanService(tranCd: number, res: Response) {
        try {
            const planId: any = sanitize(tranCd)

            const checkExist = await this.prisma.plan_mst.findUnique({
                where: {
                    id: Number(planId),
                }
            })

            if (!checkExist) {
                return this.helperService.response(res, 404, false, "No data found", null);
            }

            await this.prisma.$transaction(async (db) => {
                await db.plan_mst.delete({
                    where: {
                        id: Number(planId)
                    },
                });
            });

            return this.helperService.response(res, 200, true, "Success", null);
        } catch (error) {
            this.logger.log(error.message, error.stack, 'delete_plan');
            this.helperService.exceptionHandler(error);
        }
    }

    async updatePlanStatusService(tranCd: number, req: Request, res: Response) {
        try {
            const planId: any = sanitize(tranCd);

            const { loginUser }: any = req.user;

            if (loginUser?.company_mst?.comp_cd !== "999999") {
                return this.helperService.response(res, 401, false, "Your hosiptal have not permissioned to add new hospital.", null);
            }

            const currentStatus: { is_active?: boolean, two_fa?: boolean } = await this.prisma.plan_mst.findUnique({
                where: {
                    id: Number(planId)
                },
                select: {
                    is_active: true
                }
            });

            if (!currentStatus) {
                return this.helperService.response(res, 404, false, msg.noDataFound, null);
            }

            const updateVal = await this.prisma.company_mst.update({
                where: {
                    id: Number(planId)
                },
                data: {
                    is_active: !currentStatus.is_active
                }
            });

            const resMessageOfStatus = "Plan status is successfully" + updateVal.is_active ? "active" : "inactive";

            return this.helperService.response(res, 200, true, resMessageOfStatus, null);
        } catch (error) {
            this.logger.log(error.message, error.stack, 'delete_plan');
            this.helperService.exceptionHandler(error);
        }
    }

    async getPlans(req: Request, res: Response) {
        try {

            const { loginUser }: any = req.user;

            if (loginUser?.company_mst?.comp_cd !== "999999") {
                return this.helperService.response(res, 401, false, "Your hosiptal have not permissioned to add new hospital.", null);
            }

            const planList: getPlanList[] = await this.prisma.plan_mst.findMany({
                select: {
                    id: true,
                    plan_nm: true,
                    price: true,
                    validate_for: true,
                    validate_type: true,
                    is_active: true,
                    description: true,
                    entry_by: true,
                    entry_dt: true,
                    update_by: true,
                    update_dt: true,
                }
            });


            if (!planList || planList.length === 0) {
                return this.helperService.response(res, 404, false, msg.noDataFound, null);
            }

            const updatedObjNm = await Promise.all(planList.map(async (p: getPlanList) => ({
                tranCd: p.id,
                planNm: p.plan_nm,
                price: parseFloat(p.price).toFixed(2),
                validFor: p.validate_for + " " + (p.validate_type === "M" ? "Month" : "Day") + (p.validate_for > 1 ? "s" : ""),
                isActive: p.is_active,
                description: p.description,
                entryBy: p.entry_by ? await this.commonService.entryByUserNm(p.entry_by, "get_hospitals") : null,
                entryDt: p.entry_dt ? this.helperService.dateFormat(p.entry_dt) : null,
                updateBy: p.update_by ? await this.commonService.entryByUserNm(p.update_by, "get_hospitals") : null,
                updateDt: p.update_dt ? this.helperService.dateFormat(p.update_dt) : null
            })))

            return this.helperService.response(res, 200, true, "Success", updatedObjNm);
        } catch (error) {
            this.logger.log(error.message, error.stack, 'get_plans');
            this.helperService.exceptionHandler(error);
        }
    }

    async getPlanDtl(tranCd: number, req: Request, res: Response) {
        try {
            const planId: any = sanitize(tranCd);

            const { loginUser }: any = req.user;

            if (loginUser?.company_mst?.comp_cd !== "999999") {
                return this.helperService.response(res, 401, false, "Your hosiptal have not permissioned to add new hospital.", null);
            }

            const planList = await this.prisma.plan_mst.findUnique({
                where: { id: planId },
                select: {
                    id: true,
                    plan_nm: true,
                    price: true,
                    validate_for: true,
                    validate_type: true,
                    is_active: true,
                    description: true,
                    entry_by: true,
                    entry_dt: true,
                    update_by: true,
                    update_dt: true,
                    plan_module_dtl: {
                        select: {
                            app_module_mst: {
                                select: {
                                    id: true,
                                    module_nm: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!planList) {
                return this.helperService.response(res, 404, false, msg.noDataFound, null);
            }

            const updatedObjNm = {
                tranCd: planList.id,
                planNm: planList.plan_nm,
                price: parseFloat(planList.price.toString()).toFixed(2),
                validFor: planList.validate_for + " " + (planList.validate_type === "M" ? "Month" : "Day") + (planList.validate_for > 1 ? "s" : ""),
                validateFor: planList.validate_for,
                validateType: planList.validate_type,
                isActive: planList.is_active,
                description: planList.description,
                modules: planList.plan_module_dtl.map((m: { app_module_mst: { id: number, module_nm: string } }) => ({
                    moduleId: m.app_module_mst.id,
                    moduleNm: m.app_module_mst.module_nm,
                })),
                entryBy: planList.entry_by ? await this.commonService.entryByUserNm(planList.entry_by, "get_plan_details") : null,
                entryDt: planList.entry_dt ? this.helperService.dateFormat(planList.entry_dt) : null,
                updateBy: planList.update_by ? await this.commonService.entryByUserNm(planList.update_by, "get_plan_details") : null,
                updateDt: planList.update_dt ? this.helperService.dateFormat(planList.update_dt) : null
            }

            return this.helperService.response(res, 200, true, "Success", updatedObjNm);
        } catch (error) {
            this.logger.log(error.message, error.stack, 'get_plans');
            this.helperService.exceptionHandler(error);
        }
    }

}
