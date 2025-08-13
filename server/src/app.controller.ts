import { Controller, Get, HttpStatus } from "@nestjs/common";

import { MESSAGE } from "@/common/constant/message";
import { SuccessResponseInterface } from "@/common/interface/response.interface";

import { LoggerService } from "./provider/logger.service";
import { UtilityService } from "./provider/utility.service";

@Controller()
export class AppController {
    private readonly loggerService: LoggerService;

    constructor(private readonly utilityService: UtilityService) {
        this.loggerService = new LoggerService(AppController.name);
    }

    @Get()
    get(): SuccessResponseInterface<null> {
        this.loggerService.log({
            message: MESSAGE.GENERAL.START,
            addedContext: this.get.name,
        });

        return this.utilityService.generateSuccessResponse<null>({
            status: HttpStatus.OK,
            message: "SmartMedGuard API server",
            data: null,
        });
    }
}
