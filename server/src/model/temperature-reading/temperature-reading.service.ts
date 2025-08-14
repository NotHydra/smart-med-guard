import { Injectable } from "@nestjs/common";
import { IoTDevice, TemperatureReading } from "@prisma/client";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "@/provider/logger.service";
import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

import { IoTDeviceService } from "@/model/iot-device/iot-device.service";

@Injectable()
export class TemperatureReadingService {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService,
        private readonly prisma: PrismaService,
        private readonly iotDeviceService: IoTDeviceService
    ) {
        this.loggerService = new LoggerService(TemperatureReadingService.name);
    }

    public async add({
        agency,
        floor,
        room,
        temperature,
    }: {
        agency: string;
        floor: string;
        room: string;
        temperature: number;
    }): Promise<TemperatureReading> {
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
                    temperature: temperature,
                })}`,
                addedContext: this.add.name,
            });

            const iotDevice: IoTDevice = await this.iotDeviceService.findOrCreate({
                agency: agency,
                floor: floor,
                room: room,
            });

            const model: TemperatureReading = await this.prisma.temperatureReading.create({
                data: {
                    iotDeviceId: iotDevice.id,
                    temperature: temperature,
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
