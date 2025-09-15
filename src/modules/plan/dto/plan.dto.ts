import { Optional } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsDecimal, IsEnum, IsJSON, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

enum validityType {
    D = "D", // "Day",
    M = "M", // "Month",
}


export class addPlanDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    compId: number;

    @ApiProperty()
    @IsNumber()
    branchId: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    domain: string;

    @ApiProperty()
    @IsString()
    @Optional()
    ipAddress?: string;

    @ApiProperty()
    @Optional()
    latitude?: string;

    @ApiProperty()
    @Optional()
    longitude?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    planNm: string;

    @ApiProperty()
    @IsDecimal()
    @IsNotEmpty()
    price: string;

    @ApiProperty({ enum: validityType })
    @IsEnum(validityType)
    @IsNotEmpty()
    validate_type: validityType;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    validate_for: number;

    @ApiProperty()
    @IsJSON()
    @IsNotEmpty()
    features: {};

    @ApiPropertyOptional()
    @IsString()
    @MaxLength(300)
    description: string;

    @ApiProperty()
    @IsArray()
    planModules: [{
        moduleId: number,
        isExist: boolean,
        isDelete: boolean,
    }];
}