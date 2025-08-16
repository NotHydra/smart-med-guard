import { Injectable } from "@nestjs/common";
import { OccupancyReading } from "@prisma/client";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "@/provider/logger.service";
import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

import { IoTDeviceService } from "@/model/iot-device/iot-device.service";

@Injectable()
export class OccupancyReadingService {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService,
        private readonly prisma: PrismaService,
        private readonly iotDeviceService: IoTDeviceService
    ) {
        this.loggerService = new LoggerService(OccupancyReadingService.name);
    }

    public async add({
        iotDeviceId,
        occupancy,
    }: {
        iotDeviceId: string;
        occupancy: boolean;
    }): Promise<OccupancyReading> {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.add.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    iotDeviceId: iotDeviceId,
                    occupancy: occupancy,
                })}`,
                addedContext: this.add.name,
            });

            const model: OccupancyReading = await this.prisma.occupancyReading.create({
                data: {
                    iotDeviceId: iotDeviceId,
                    occupancy: occupancy,
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
