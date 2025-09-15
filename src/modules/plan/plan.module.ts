import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { DatabaseService } from 'src/database/database.service';
import { HelperService } from 'src/common/utils/helper/helper.service';
import { StaffService } from '../staff/staff.service';
import { CommonServices } from 'src/common/services/common.service';

@Module({
  controllers: [PlanController],
  providers: [
    PlanService,
    DatabaseService,
    HelperService,
    StaffService,
    CommonServices
  ]
})
export class PlanModule { }
