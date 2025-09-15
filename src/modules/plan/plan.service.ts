import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { addPlanDto } from './dto/plan.dto';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HelperService } from 'src/common/utils/helper/helper.service';
import { DatabaseService } from 'src/database/database.service';
import { CommonServices } from 'src/common/services/common.service';

@Injectable()
export class PlanService {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private helperService: HelperService,
        private prisma: DatabaseService,
        private commonService: CommonServices
    ) { }

    addPlanService(addPlanDto: addPlanDto, req: Request, res: Response) {
        try {

            const requser = req.user;

            if (addPlanDto.validate_type === "D" && addPlanDto.validate_for < 30) {
                return this.helperService.response(res, 401, false, "You don't create more than 30 days or select months", null);
            } else if (addPlanDto.validate_type === "M" && addPlanDto.validate_for < 18) {
                return this.helperService.response(res, 401, false, "You don't create more than 18 months", null);
            }

            // await this.prisma.$transaction(async (db) => {

            // })


        } catch (error) {

        }

    }
}
