import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthServices } from './auth.service';
import { DatabaseService } from '../../database/database.service';
import { StaffService } from '../staff/staff.service';
import { HelperService } from '../../common/utils/helper/helper.service';
import { BasicauthStrategy } from './strategies/basicauth.strategy';
import { PassportModule } from '@nestjs/passport';
import { GenerateTknService } from '../../common/utils/helper/generate-tkn.service';
import { JwtService } from '@nestjs/jwt';
import { TempTokenStrategy } from './strategies/tempTkn.strategy';
import { AccessTokenStrategy } from './strategies/accesstkn.strategy';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [
    AuthServices,
    BasicauthStrategy,
    AccessTokenStrategy,
    TempTokenStrategy,
    DatabaseService,
    StaffService,
    HelperService,
    GenerateTknService,
    JwtService,
  ],
  exports: [AuthServices]
})
export class AuthModule { }
