import { Optional } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsDecimal, IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

enum hostType {
    P = "P", // "Private Hospital",
    T = "T", // "Trust Hospital",
    G = "G", // "Goverment Hospital"
}

enum smsMethod {
    POST = "POST",
    GET = "GET"
}


export class getCompanyDtlDto {
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