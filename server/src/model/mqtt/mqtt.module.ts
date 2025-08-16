import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { ConfigModule } from "@/config/config.module";
import { ConfigService } from "@/config/config.service";

import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

import { HumidityReadingService } from "@/model/humidity-reading/humidity-reading.service";
import { IoTDeviceService } from "@/model/iot-device/iot-device.service";
import { OccupancyReadingService } from "@/model/occupancy-reading/occupancy-reading.service";
import { TemperatureReadingService } from "@/model/temperature-reading/temperature-reading.service";
import { WebSocketService } from "@/model/web-socket/web-socket.service";

import { MQTTController } from "./mqtt.controller";
import { MQTTService } from "./mqtt.service";

@Module({
    controllers: [MQTTController],
    providers: [
        ConfigService,
        UtilityService,
        PrismaService,
        IoTDeviceService,
        TemperatureReadingService,
        HumidityReadingService,
        OccupancyReadingService,
        WebSocketService,
        MQTTService,
    ],
    imports: [
        ClientsModule.registerAsync([
            {
                name: "MQTT_SERVICE",
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.MQTT,
                    options: {
                        url: configService.getMQTTURL(),
                    },
                }),
            },
        ]),
    ],
    exports: [],
})
export class MQTTModule {}
