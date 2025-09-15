import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class refreshTokenDto {
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

    @ApiProperty({ description: 'Refresh token is requied' })
    @IsString()
    @IsNotEmpty()
    refreskTkn: string;

    @ApiProperty({ description: 'Request Domain' })
    @IsString()
    @IsNotEmpty()
    domain: string;

    @ApiProperty({ description: 'Requested Ip Address' })
    @IsString()
    @Optional()
    ipAddress?: string;

    @ApiProperty({ description: 'Requested Latitude' })
    @IsDecimal()
    latitude?: string;

    @ApiProperty({ description: 'Requested Longitude' })
    @IsDecimal()
    longitude?: string;
}
