import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

enum actionType {
    P = "T", // "Two Factor authentication",
    T = "S", // "Status",
}

export class updateCompanyStatusDto {
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


    @ApiProperty({ description: 'updated hospital id' })
    @IsNotEmpty()
    @IsNumber()
    tranId: number;

    @ApiProperty({ description: 'Action type for update action', enum: actionType })
    @IsEnum(actionType)
    @IsNotEmpty()
    @IsNumber()
    actionType: actionType;
}