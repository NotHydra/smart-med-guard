import { Injectable } from "@nestjs/common";
import { HumidityReading } from "@prisma/client";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "@/provider/logger.service";
import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

@Injectable()
export class HumidityReadingService {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService,
        private readonly prisma: PrismaService
    ) {
        this.loggerService = new LoggerService(HumidityReadingService.name);
    }

    public async add({
        iotDeviceId, //
        humidity,
        timestamp,
    }: {
        iotDeviceId: string;
        humidity: number;
        timestamp: string;
    }): Promise<HumidityReading> {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.add.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    iotDeviceId: iotDeviceId,
                    humidity: humidity,
                    timestamp: timestamp,
                })}`,
                addedContext: this.add.name,
            });

            const model: HumidityReading = await this.prisma.humidityReading.create({
                data: {
                    iotDeviceId: iotDeviceId,
                    value: humidity,
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
