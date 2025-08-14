import { Injectable } from "@nestjs/common";
import { HumidityReading, IoTDevice } from "@prisma/client";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "@/provider/logger.service";
import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

import { IoTDeviceService } from "@/model//iot-device/iot-device.service";

@Injectable()
export class HumidityReadingService {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService,
        private readonly prisma: PrismaService,
        private readonly iotDeviceService: IoTDeviceService
    ) {
        this.loggerService = new LoggerService(HumidityReadingService.name);
    }

    public async add({
        agency,
        floor,
        room,
        humidity,
    }: {
        agency: string;
        floor: string;
        room: string;
        humidity: number;
    }): Promise<HumidityReading> {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.add.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    agency: agency,
                    floor: floor,
                    room: room,
                    humidity: humidity,
                })}`,
                addedContext: this.add.name,
            });

            const iotDevice: IoTDevice = await this.iotDeviceService.findOrCreate({
                agency: agency,
                floor: floor,
                room: room,
            });

            const model: HumidityReading = await this.prisma.humidityReading.create({
                data: {
                    iotDeviceId: iotDevice.id,
                    humidity: humidity,
                },
            });

            this.loggerService.log({
                message: `${MESSAGE.GENERAL.RESULT}: ${this.utilityService.pretty({
                    iotDevice: iotDevice,
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
