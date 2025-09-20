import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { addPlanDto, editPlanDto, getPlanDtlDto } from './dto/plan.dto';
import { Request, Response } from 'express';
import { commonDto } from 'src/common/dto/common.dto';

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
    async addPlan(@Body() addPlanDto: addPlanDto, @Req() req: Request, @Res() res: Response) {
        await this.planService.addPlanService(addPlanDto, req, res);
    }

    @ApiOperation({})
    @ApiBody({ type: editPlanDto, description: 'edit subscription plan' })
    @ApiResponse({ status: 200, description: 'Plan successfully updated' })
    @ApiBearerAuth()
    @Roles("SUP")
    @Put('edit' + "/:id")
    async editPlan(@Param('id') tranCd: number, @Body() editPlanDto: editPlanDto, @Req() req: Request, @Res() res: Response) {
        await this.planService.editPlanService(tranCd, editPlanDto, req, res);
    }

    @ApiOperation({})
    @ApiBody({ type: commonDto, description: 'delete subscription plan' })
    @ApiResponse({ status: 200, description: 'Plan successfully deleted' })
    @ApiBearerAuth()
    @Roles("SUP")
    @Delete('delete' + "/:id")
    async deletePlan(@Param('id') tranCd: number, @Res() res: Response) {
        await this.planService.deletePlanService(tranCd, res);
    }


    @ApiOperation({})
    @ApiBody({ type: commonDto, description: 'update subscription plan status' })
    @ApiResponse({ status: 200, description: 'Plan status successfully updated' })
    @ApiBearerAuth()
    @Roles("SUP")
    @Put('update-status' + "/:id")
    async updatePlanStatus(@Param('id') tranCd: number, @Req() req: Request, @Res() res: Response) {
        await this.planService.updatePlanStatusService(tranCd, req, res);
    }

    @ApiOperation({})
    @ApiBody({ type: commonDto, description: 'update subscription plan status' })
    @ApiResponse({ status: 200, description: 'Plan status successfully updated' })
    @ApiBearerAuth()
    @Roles("SUP")
    @Post('get')
    async getPlan(@Req() req: Request, @Res() res: Response) {
        await this.planService.getPlans(req, res);
    }

    @ApiOperation({})
    @ApiBody({ type: getPlanDtlDto, description: 'Get subscription plan Details' })
    @ApiResponse({ status: 200, description: 'Plan details successfully getted' })
    @ApiBearerAuth()
    @Roles("SUP")
    @Post('get-details')
    async getPlanDtl(@Body('tranCd') tranCd: number, @Req() req: Request, @Res() res: Response) {
        await this.planService.getPlanDtl(tranCd, req, res);
    }
}
