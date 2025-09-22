import { Module } from "@nestjs/common";

import { ConfigService } from "@/config/config.service";

import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

import { IoTDeviceService } from "@/model/iot-device/iot-device.service";

import { HumidityReadingService } from "./humidity-reading.service";

@Module({
    providers: [
        ConfigService, //
        UtilityService,
        PrismaService,
        IoTDeviceService,
        HumidityReadingService,
    ],
    exports: [
        HumidityReadingService, //
    ],
})
export class HumidityReadingModule {}
