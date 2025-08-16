import { Module } from "@nestjs/common";

import { ConfigService } from "@/config/config.service";

import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

import { IoTDeviceService } from "@/model/iot-device/iot-device.service";

import { WebSocketController } from "./web-socket.controller";
import { WebSocketService } from "./web-socket.service";

@Module({
    controllers: [WebSocketController],
    providers: [ConfigService, UtilityService, PrismaService, IoTDeviceService, WebSocketService],
    imports: [],
    exports: [],
})
export class WebSocketModule {}
