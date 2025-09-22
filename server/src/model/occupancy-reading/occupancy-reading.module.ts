import { Module } from "@nestjs/common";

import { ConfigService } from "@/config/config.service";

import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

import { IoTDeviceService } from "@/model/iot-device/iot-device.service";

import { OccupancyReadingService } from "./occupancy-reading.service";

@Module({
    providers: [
        ConfigService, //
        UtilityService,
        PrismaService,
        IoTDeviceService,
        OccupancyReadingService,
    ],
    exports: [
        OccupancyReadingService, //
    ],
})
export class OccupancyReadingModule {}
