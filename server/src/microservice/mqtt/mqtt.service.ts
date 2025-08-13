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

    public publish(): null {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.publish.name,
            });

            const topic: string = "hello";
            const payload: { message: string } = { message: `Hello from NestJS at ${new Date().toISOString()}` };

            this.client.emit(topic, JSON.stringify(payload));

            this.loggerService.log({
                message: `${MESSAGE.GENERAL.RESULT}: ${this.utilityService.pretty({
                    topic: topic,
                    payload: this.utilityService.pretty(payload),
                })}`,
                addedContext: this.publish.name,
            });

            return null;
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.publish.name,
            });

            throw new InternalServerErrorException("Internal Server Error");
        }
    }
}
