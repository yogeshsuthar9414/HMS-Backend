import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class verifyOtpDto {
    @ApiProperty({ description: 'User Id is required' })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ description: 'Company Id is required' })
    @IsNumber()
    @IsNotEmpty()
    compId: number;

    @ApiProperty({ description: 'Branch Id is requied' })
    @IsNumber()
    branchId: number;

    @ApiProperty({ description: 'Otp Code is required' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(6)
    otpCode: string;

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
