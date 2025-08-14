import { Module } from "@nestjs/common";

import { ConfigService } from "@/config/config.service";

import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

import { IoTDeviceService } from "@/model/iot-device/iot-device.service";

import { TemperatureReadingService } from "./temperature-reading.service";

@Module({
    controllers: [],
    providers: [ConfigService, UtilityService, PrismaService, IoTDeviceService, TemperatureReadingService],
    imports: [],
    exports: [TemperatureReadingService],
})
export class TemperatureReadingModule {}
