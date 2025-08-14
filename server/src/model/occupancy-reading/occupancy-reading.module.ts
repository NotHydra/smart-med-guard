import { Module } from "@nestjs/common";

import { ConfigService } from "@/config/config.service";

import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

import { IoTDeviceService } from "@/model/iot-device/iot-device.service";

import { OccupancyReadingService } from "./occupancy-reading.service";

@Module({
    controllers: [],
    providers: [ConfigService, UtilityService, PrismaService, IoTDeviceService, OccupancyReadingService],
    imports: [],
    exports: [OccupancyReadingService],
})
export class OccupancyReadingModule {}
