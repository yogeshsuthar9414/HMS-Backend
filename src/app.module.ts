import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { StaffModule } from './modules/staff/staff.module';
import { DatabaseService } from 'src/database/database.service';
import { HelperService } from './common/utils/helper/helper.service';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfig } from './common/logger/winston-logger';
import { GenerateTknService } from './common/utils/helper/generate-tkn.service';
import { JwtService } from '@nestjs/jwt';
import { CompanyModule } from './modules/company/company.module';
import { AccessTokenGuard } from './modules/auth/guard/accesstkn.guard';
import { PlanModule } from './modules/plan/plan.module';
  
@Module({
  imports: [
    WinstonModule.forRoot(winstonLoggerConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    StaffModule,
    CompanyModule,
    PlanModule
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AccessTokenGuard,
    },
    DatabaseService,
    HelperService,
    GenerateTknService,
    JwtService
  ],
  exports: [DatabaseService],
})
export class AppModule { }
