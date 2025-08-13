import { Controller, Get, HttpStatus } from "@nestjs/common";
import { Ctx, MessagePattern, MqttContext, Payload } from "@nestjs/microservices";

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

    @MessagePattern("iot-device/+/+/+/temperature")
    iotDeviceTemperature(@Payload() payload: string, @Ctx() context: MqttContext): void {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.iotDeviceTemperature.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    payload: payload,
                    context: context,
                })}`,
                addedContext: this.iotDeviceTemperature.name,
            });

            const splittedTopic: string[] = context.getTopic().split("/");

            this.mqttService.iotDeviceTemperature({
                agency: splittedTopic[1],
                floor: splittedTopic[2],
                room: splittedTopic[3],
                temperature: JSON.parse(payload),
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.iotDeviceTemperature.name,
            });

            throw error;
        }
    }

    @MessagePattern("iot-device/+/+/+/humidity")
    iotDeviceHumidity(@Payload() payload: string, @Ctx() context: MqttContext): void {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.iotDeviceHumidity.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    payload: payload,
                    context: context,
                })}`,
                addedContext: this.iotDeviceHumidity.name,
            });

            const splittedTopic: string[] = context.getTopic().split("/");

            this.mqttService.iotDeviceHumidity({
                agency: splittedTopic[1],
                floor: splittedTopic[2],
                room: splittedTopic[3],
                humidity: JSON.parse(payload),
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.iotDeviceHumidity.name,
            });

            throw error;
        }
    }

    @MessagePattern("iot-device/+/+/+/occupancy")
    iotDeviceOccupancy(@Payload() payload: string, @Ctx() context: MqttContext): void {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.iotDeviceOccupancy.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    payload: payload,
                    context: context,
                })}`,
                addedContext: this.iotDeviceOccupancy.name,
            });

            const splittedTopic: string[] = context.getTopic().split("/");

            this.mqttService.iotDeviceOccupancy({
                agency: splittedTopic[1],
                floor: splittedTopic[2],
                room: splittedTopic[3],
                occupancy: JSON.parse(payload),
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.iotDeviceOccupancy.name,
            });

            throw error;
        }
    }
}
