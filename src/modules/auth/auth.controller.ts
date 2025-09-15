import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { loginDto } from './dto/auth.dto';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthServices } from './auth.service';
import { BasicauthGuard } from './guard/basicauth.guard';
import { verifyGAuthOtpDto } from './dto/verifyGAuthOtp.dto';
import { TempTokenGuard } from './guard/tempTkn.guard';
import { verifyOtpDto } from './dto/verifyOtp.dto';
import { logoutOutDto } from './dto/logout.dto';
import { AccessTokenGuard } from './guard/accesstkn.guard';
import { refreshTokenDto } from './dto/refreshTkn.dto';
import { Public } from 'src/common/decorator/allowPublic.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthServices) { }

  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: loginDto, description: 'Login to hospital staff' })
  @ApiResponse({ status: 200, description: 'Successful login.' })
  @ApiBasicAuth()
  @Public()
  @UseGuards(BasicauthGuard)
  @Post('login')
  async login(@Body() loginDto: loginDto, @Req() req: Request, @Res() res: Response,) {
    await this.authService.login(loginDto, req, res);
  }

  @ApiOperation({ summary: 'Verify Google Authenticator Code' })
  @ApiBody({ type: verifyGAuthOtpDto, description: 'Verify Google Authenticator Code on generate time' })
  @ApiResponse({ status: 200, description: 'Verify successfully' })
  @ApiBearerAuth()
  @Public()
  @UseGuards(TempTokenGuard)
  @Post('verify-gauth-otp')
  async verifyGAuthOtp(@Body() verifyGAuthOtpDto: verifyGAuthOtpDto, @Req() req: Request, @Res() res: Response,) {
    await this.authService.verifyGAuthOtpService(verifyGAuthOtpDto, req, res);
  }

  @ApiOperation({ summary: 'OTP Verify' })
  @ApiBody({ type: verifyOtpDto, description: 'OTP Verify' })
  @ApiResponse({ status: 200, description: 'Verify successfully' })
  @ApiBearerAuth()
  @Public()
  @UseGuards(TempTokenGuard)
  @Post('verify-otp')
  async verifyotp(@Body() verifyOtpDto: verifyOtpDto, @Req() req: Request, @Res() res: Response,) {
    await this.authService.validateOtpService(verifyOtpDto, req, res);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiBody({ type: logoutOutDto })
  @ApiResponse({ status: 200, description: 'Logout Successfully' })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('log-out')
  async logout(@Body() logoutOutDto: logoutOutDto, @Res() res: Response) {
    await this.authService.logoutService(logoutOutDto, res);
  }

  @ApiOperation({ summary: 'Refresh Token' })
  @ApiBody({ type: refreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token refreshed succesfully' })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('refresh-token')
  async refreshTkn(@Body() refreshTokenDto: refreshTokenDto, @Req() req: Request, @Res() res: Response) {
    await this.authService.refreshTokanService(refreshTokenDto, req, res);
  }
}
