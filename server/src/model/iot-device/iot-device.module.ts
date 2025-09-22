import { Module } from "@nestjs/common";

import { ConfigService } from "@/config/config.service";

import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

import { IoTDeviceController } from "./iot-device.controller";
import { IoTDeviceService } from "./iot-device.service";

@Module({
    controllers: [
        IoTDeviceController, //
    ],
    providers: [
        ConfigService, //
        UtilityService,
        PrismaService,
        IoTDeviceService,
    ],
    exports: [
        IoTDeviceService, //
    ],
})
export class IoTDeviceModule {}
