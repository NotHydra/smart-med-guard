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
    subscribeHello(@Payload() payload: string, @Ctx() context: MqttContext): void {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.subscribeHello.name,
            });

            this.loggerService.verbose({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    payload: payload,
                    context: context,
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
    async subscribeIoTDeviceTemperature(@Payload() payload: string, @Ctx() context: MqttContext): Promise<void> {
        try {
            this.loggerService.verbose({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.subscribeIoTDeviceTemperature.name,
            });

            this.loggerService.verbose({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    payload: payload,
                    context: context,
                })}`,
                addedContext: this.subscribeIoTDeviceTemperature.name,
            });

            const splittedTopic: string[] = context.getTopic().split("/");

            await this.mqttService.subscribeIoTDeviceTemperature({
                agency: splittedTopic[1],
                floor: splittedTopic[2],
                room: splittedTopic[3],
                temperature: JSON.parse(payload) as number,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.subscribeIoTDeviceTemperature.name,
            });

            throw error;
        }
    }

    @MessagePattern("iot-device/+/+/+/humidity")
    async subscribeIoTDeviceHumidity(@Payload() payload: string, @Ctx() context: MqttContext): Promise<void> {
        try {
            this.loggerService.verbose({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.subscribeIoTDeviceHumidity.name,
            });

            this.loggerService.verbose({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    payload: payload,
                    context: context,
                })}`,
                addedContext: this.subscribeIoTDeviceHumidity.name,
            });

            const splittedTopic: string[] = context.getTopic().split("/");

            await this.mqttService.subscribeIoTDeviceHumidity({
                agency: splittedTopic[1],
                floor: splittedTopic[2],
                room: splittedTopic[3],
                humidity: JSON.parse(payload) as number,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.subscribeIoTDeviceHumidity.name,
            });

            throw error;
        }
    }

    @MessagePattern("iot-device/+/+/+/occupancy")
    async subscribeIoTDeviceOccupancy(@Payload() payload: string, @Ctx() context: MqttContext): Promise<void> {
        try {
            this.loggerService.verbose({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.subscribeIoTDeviceOccupancy.name,
            });

            this.loggerService.verbose({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    payload: payload,
                    context: context,
                })}`,
                addedContext: this.subscribeIoTDeviceOccupancy.name,
            });

            const splittedTopic: string[] = context.getTopic().split("/");

            await this.mqttService.subscribeIoTDeviceOccupancy({
                agency: splittedTopic[1],
                floor: splittedTopic[2],
                room: splittedTopic[3],
                occupancy: JSON.parse(payload) as boolean,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.subscribeIoTDeviceOccupancy.name,
            });

            throw error;
        }
    }
}
