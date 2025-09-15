import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { addCompanyDto } from './dto/addCompany.dto';
import { CompanyService } from './company.service';
import { Request, Response } from 'express';
import { Roles } from 'src/common/decorator/roles.decorator';
import { commonDto } from 'src/common/dto/common.dto';
import { updateCompanyStatusDto } from './dto/updateCompanyStatus.dto';

@Controller('company')
export class CompanyController {

    constructor(
        private companyService: CompanyService
    ) { }

    @ApiOperation({})
    @ApiBody({ type: addCompanyDto, description: 'Add Company or Hospital' })
    @ApiResponse({ status: 200, description: 'Add company successfully' })
    @ApiBearerAuth()
    @Roles("SUP")
    @Post('add')
    async addCompany(@Body() addCompanyDto: addCompanyDto, @Req() req: Request, @Res() res: Response) {
        await this.companyService.addCompanyService(addCompanyDto, req, res);
    }

    @ApiOperation({})
    @ApiBody({ type: commonDto, description: 'success' })
    @ApiResponse({ status: 200, description: 'success' })
    @ApiBearerAuth()
    @Roles("SUP")
    @Post('get-company-code')
    async getClientCd(@Req() req: Request, @Res() res: Response) {
        await this.companyService.getClientCdService(req, res);
    }

    @ApiOperation({})
    @ApiBody({ type: commonDto, description: 'success' })
    @ApiResponse({ status: 200, description: 'success' })
    @ApiBearerAuth()
    @Roles("SUP")
    @Post('get-companies')
    async getClients(@Req() req: Request, @Res() res: Response) {
        await this.companyService.getClients(req, res);
    }

    @ApiOperation({})
    @ApiBody({ type: updateCompanyStatusDto, description: 'success' })
    @ApiResponse({ status: 200, description: 'success' })
    @ApiBearerAuth()
    @Roles("SUP")
    @Post('update-company-status')
    async updateCompanyStatus(@Body() reqBody: updateCompanyStatusDto, @Req() req: Request, @Res() res: Response) {
        await this.companyService.updateCompanyStatusService(reqBody, req, res);
    }

    @ApiOperation({})
    @ApiBody({ type: updateCompanyStatusDto, description: 'success' })
    @ApiResponse({ status: 200, description: 'success' })
    @ApiBearerAuth()
    @Roles("SUP")
    @Post('get-company-details')
    async getCompanyDtl(@Body() reqBody: updateCompanyStatusDto, @Res() res: Response) {
        await this.companyService.getCompanyDtlServiecs(reqBody, res);
    }
}
