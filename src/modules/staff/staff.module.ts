import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { DatabaseService } from '../../database/database.service';
import { HelperService } from '../../common/utils/helper/helper.service';

@Module({
  controllers: [StaffController],
  providers: [
    DatabaseService,
    StaffService,
    HelperService,
  ],
})
export class StaffModule { }
