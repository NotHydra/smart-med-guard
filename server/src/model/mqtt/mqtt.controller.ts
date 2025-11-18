import { Controller, Get, HttpStatus } from "@nestjs/common";
import { Ctx, MessagePattern, MqttContext, Payload } from "@nestjs/microservices";

import { MESSAGE } from "@/common/constant/message";
import { SuccessResponseInterface } from "@/common/interface/response.interface";

import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

import { IoTDevicePayload } from "@/model/iot-device/iot-device";

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

    @MessagePattern("iot-device/+/+/+")
    async subscribeIoTDevice(@Payload() payload: string, @Ctx() context: MqttContext): Promise<void> {
        try {
            this.loggerService.verbose({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.subscribeIoTDevice.name,
            });

            this.loggerService.verbose({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    payload: payload,
                    context: context,
                })}`,
                addedContext: this.subscribeIoTDevice.name,
            });

            const data: IoTDevicePayload = JSON.parse(payload);

            await this.mqttService.subscribeIoTDevice({
                agency: data.agency,
                floor: data.floor,
                room: data.room,
                temperature: data.temperature,
                humidity: data.humidity,
                occupancy: data.occupancy,
                timestamp: data.timestamp,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.subscribeIoTDevice.name,
            });

            throw error;
        }
    }
}
