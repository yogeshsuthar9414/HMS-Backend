import { Optional } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsDecimal, IsEnum, IsJSON, IsNotEmpty, isNumber, IsNumber, IsString, MaxLength } from "class-validator";

enum validityType {
    D = "D", // "Day",
    M = "M", // "Month",
}

class PlanModuleDto {
    @ApiProperty() moduleId: number;
    @ApiProperty() isExist: boolean;
    @ApiProperty() isDelete: boolean;
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
    validateType: validityType;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    validateFor: number;

    @ApiProperty()
    @IsNotEmpty()
    features: any;

    @ApiPropertyOptional()
    @IsString()
    @MaxLength(300)
    description: string;

    @ApiProperty({ type: [PlanModuleDto] })
    @IsArray()
    planModules: PlanModuleDto[];
}




export class editPlanDto {
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
    @IsNumber()
    @IsNotEmpty()
    tranId: number;

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
    validateType: validityType;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    validateFor: number;

    @ApiProperty()
    @IsNotEmpty()
    features: any;

    @ApiPropertyOptional()
    @IsString()
    @MaxLength(300)
    description: string;

    @ApiProperty({ type: [PlanModuleDto] })
    @IsArray()
    planModules: PlanModuleDto[];
}



export class getPlanDtlDto {
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
    @IsNumber()
    @IsNotEmpty()
    tranCd: number;
}