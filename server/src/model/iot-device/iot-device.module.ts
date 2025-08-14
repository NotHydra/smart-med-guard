import { Module } from "@nestjs/common";

import { ConfigService } from "@/config/config.service";

import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

import { IoTDeviceService } from "./iot-device.service";

@Module({
    controllers: [],
    providers: [ConfigService, UtilityService, PrismaService, IoTDeviceService],
    imports: [],
    exports: [IoTDeviceService],
})
export class IoTDeviceModule {}
