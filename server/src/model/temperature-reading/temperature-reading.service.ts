import { Injectable } from "@nestjs/common";
import { TemperatureReading } from "@prisma/client";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "@/provider/logger.service";
import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

@Injectable()
export class TemperatureReadingService {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService,
        private readonly prisma: PrismaService
    ) {
        this.loggerService = new LoggerService(TemperatureReadingService.name);
    }

    public async add({
        iotDeviceId, //
        temperature,
        timestamp,
    }: {
        iotDeviceId: string;
        temperature: number;
        timestamp: string;
    }): Promise<TemperatureReading> {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.add.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    iotDeviceId: iotDeviceId,
                    temperature: temperature,
                    timestamp: timestamp,
                })}`,
                addedContext: this.add.name,
            });

            const model: TemperatureReading = await this.prisma.temperatureReading.create({
                data: {
                    iotDeviceId: iotDeviceId,
                    value: temperature,
                    timestamp: this.utilityService.convertToISO8601(timestamp),
                },
            });

            this.loggerService.log({
                message: `${MESSAGE.GENERAL.RESULT}: ${this.utilityService.pretty({
                    model: model,
                })}`,
                addedContext: this.add.name,
            });

            return model;
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.add.name,
            });

            throw error;
        }
    }
}
