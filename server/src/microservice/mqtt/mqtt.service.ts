import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

@Injectable()
export class MQTTService {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService,
        @Inject("MQTT_SERVICE") private client: ClientProxy
    ) {
        this.loggerService = new LoggerService(MQTTService.name);
    }

    public publishGreet(): null {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.publishGreet.name,
            });

            const topic: string = "hello";
            const payload: { message: string } = { message: `Hello from NestJS at ${new Date().toISOString()}` };

            this.client.emit(topic, JSON.stringify(payload));

            this.loggerService.log({
                message: `${MESSAGE.GENERAL.RESULT}: ${this.utilityService.pretty({
                    topic: topic,
                    payload: this.utilityService.pretty(payload),
                })}`,
                addedContext: this.publishGreet.name,
            });

            return null;
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.publishGreet.name,
            });

            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    public iotDeviceTemperature({
        agency,
        floor,
        room,
        temperature,
    }: {
        agency: string;
        floor: string;
        room: string;
        temperature: number;
    }): void {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.iotDeviceTemperature.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    agency: agency,
                    floor: floor,
                    room: room,
                    temperature: temperature,
                })}`,
                addedContext: this.iotDeviceTemperature.name,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.iotDeviceTemperature.name,
            });

            throw new InternalServerErrorException("Internal Server Error");
        }
    }
}
