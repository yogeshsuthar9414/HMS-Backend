import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { addPlanDto } from './dto/plan.dto';
import { Request, Response } from 'express';

@Controller('plan')
export class PlanController {

    constructor(
        private planService: PlanService
    ) { }

    @ApiOperation({})
    @ApiBody({ type: addPlanDto, description: 'Add subscription plan' })
    @ApiResponse({ status: 200, description: 'Plan successfully created' })
    @ApiBearerAuth()
    @Roles("SUP")
    @Post('add')
    async addCompany(@Body() addPlanDto: addPlanDto, @Req() req: Request, @Res() res: Response) {
        await this.planService.addPlanService(addPlanDto, req, res);
    }

}
