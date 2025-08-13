import { Controller, Get, HttpStatus } from "@nestjs/common";

import { MESSAGE } from "@/common/constant/message";
import { SuccessResponseInterface } from "@/common/interface/response.interface";

import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

import { MQTTService } from "./mqtt.service";

@Controller("mqtt")
export class MQTTController {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService,
        private readonly mqttService: MQTTService
    ) {
        this.loggerService = new LoggerService(MQTTController.name);
    }

    @Get("publish")
    public publish(): SuccessResponseInterface<null> {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.publish.name,
            });

            this.mqttService.publish();

            return this.utilityService.generateSuccessResponse<null>({
                status: HttpStatus.OK,
                message: "Published",
                data: null,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.publish.name,
            });

            throw error;
        }
    }
}
