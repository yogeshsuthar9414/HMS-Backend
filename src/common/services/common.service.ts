import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { DatabaseService } from "../../database/database.service";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { HelperService } from "../utils/helper/helper.service";

Injectable()
export class CommonServices {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        private prisma: DatabaseService,
        private helperService: HelperService,
    ) { }

    async entryByUserNm(id: number, trigerFrom: string) {
        try {
            const entryByUserNm = await this.prisma.staff_mst.findUnique({
                where: {
                    id: id,
                },
                select: {
                    user_nm: true
                }
            });

            return entryByUserNm.user_nm
        } catch (error) {
            this.logger.log(error.message, error.stack, `entry_by_user_nm-common-${trigerFrom}`);
            this.helperService.exceptionHandler(error);
        }
    }
}