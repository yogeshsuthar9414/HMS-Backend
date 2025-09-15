import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { HelperService } from 'src/common/utils/helper/helper.service';
import { StaffService } from '../staff/staff.service';
import { DatabaseService } from 'src/database/database.service';
import { CommonServices } from 'src/common/services/common.service';

@Module({
  controllers: [CompanyController],
  providers: [
    CompanyService,
    DatabaseService,
    HelperService,
    StaffService,
    CommonServices
  ],
})
export class CompanyModule { }
