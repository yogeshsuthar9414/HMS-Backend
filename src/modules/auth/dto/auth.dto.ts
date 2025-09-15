import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsString } from 'class-validator';

export class loginDto {
  @ApiProperty({ description: 'Username of login user' })
  @IsString()
  @IsNotEmpty()
  userNm: string;

  @ApiProperty({ description: 'Password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Request Domain' })
  @IsString()
  @IsNotEmpty()
  domain: string;

  @ApiProperty({ description: 'Requested Ip Address' })
  @IsString()
  @Optional()
  ipAddress?: string;

  @ApiProperty({ description: 'Requested Latitude' })
  @Optional()
  latitude?: string;

  @ApiProperty({ description: 'Requested Longitude' })
  @Optional()
  longitude?: string;
}
