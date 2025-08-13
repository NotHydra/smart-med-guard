import { Controller, Get, HttpStatus } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

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

    @Get("publish/greet")
    public publishGreet(): SuccessResponseInterface<null> {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.publishGreet.name,
            });

            this.mqttService.publishGreet();

            return this.utilityService.generateSuccessResponse<null>({
                status: HttpStatus.OK,
                message: "Published",
                data: null,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.publishGreet.name,
            });

            throw error;
        }
    }

    @MessagePattern("hello")
    subscribeHello(@Payload() payload: string): void {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.subscribeHello.name,
            });

            this.loggerService.log({
                message: `${MESSAGE.GENERAL.RESULT}: ${this.utilityService.pretty({
                    payload: JSON.parse(payload),
                })}`,
                addedContext: this.subscribeHello.name,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.subscribeHello.name,
            });

            throw error;
        }
    }
}
