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


export class addCompanyDto {
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

    @ApiProperty({ description: 'Hospital name is required', example: 'Apollo Hospital' })
    @IsString()
    @IsNotEmpty()
    hospitalNm: string;

    @ApiProperty({ description: 'Hospital id is required' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(6)
    hospitalId: string;

    @ApiProperty({ description: 'Domain is required' })
    @IsString()
    @IsNotEmpty()
    hospitalDomain: string;

    @ApiProperty({ description: 'Hospital type is required', enum: hostType })
    @IsEnum(hostType)
    @IsNotEmpty()
    hospitalType: hostType;

    @ApiProperty({ description: 'Mobile no. is required' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    mobileNo: string;

    @ApiProperty({ description: 'Email id is required' })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    emailId: string;

    @ApiProperty({ description: 'Address 1 is required' })
    @IsString()
    @IsNotEmpty()
    address1: string;

    @ApiPropertyOptional({ description: 'Address 2 is required' })
    @IsString()
    address2: string;

    @ApiProperty({ description: 'City is required' })
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty({ description: 'State is required' })
    @IsString()
    @IsNotEmpty()
    state: string;

    @ApiProperty({ description: 'Country is required' })
    @IsString()
    @IsNotEmpty()
    country: string;

    @ApiProperty({ description: 'Pincode is required' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(6)
    pinCd: string;

    @ApiProperty({ description: 'Allow multi branch' })
    @IsBoolean()
    @IsNotEmpty()
    isAllowMultiBranch: boolean;

    @ApiProperty({ description: 'Allow two factor authentication' })
    @IsBoolean()
    @IsNotEmpty()
    isAllowTwoFactorAuth: boolean;

    @ApiPropertyOptional({ description: 'Hospital Logo' })
    @IsString()
    logo: string;

    @ApiPropertyOptional({ description: 'Hospital Facicon' })
    @IsString()
    favIcon: string;

    @ApiPropertyOptional({ description: 'Logo width' })
    @IsNumber()
    logoWidth: number;

    @ApiPropertyOptional({ description: 'Logo height' })
    @IsNumber()
    logoHeight: number;

    @ApiProperty({ description: 'Active SMS' })
    @IsBoolean()
    isSms: boolean;

    @ApiPropertyOptional({ description: 'SMS Method', enum: smsMethod })
    @IsEnum(smsMethod)
    smsMethod: smsMethod;

    @ApiPropertyOptional({ description: 'SMS URL' })
    @IsString()
    smsUrl: string;

    @ApiProperty({ description: 'Active SMTP' })
    @IsBoolean()
    isSMTP: boolean;

    @ApiPropertyOptional({ description: 'SMTP Host' })
    @IsString()
    smtpHost: string;

    @ApiPropertyOptional({ description: 'SMTP Port' })
    @IsString()
    smtpPort: string;

    @ApiPropertyOptional({ description: 'SMTP TLS' })
    @IsString()
    smtpTls: string;

    @ApiPropertyOptional({ description: 'SMTP Username' })
    @IsString()
    smtpUsername: string;

    @ApiPropertyOptional({ description: 'SMTP Password' })
    @IsString()
    smtpPassword: string;

    @ApiPropertyOptional({ description: 'SMTP From Email Id' })
    @IsString()
    smtpFrom: string;
}