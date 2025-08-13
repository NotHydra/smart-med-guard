import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { ConfigModule } from "@/config/config.module";
import { ConfigService } from "@/config/config.service";

import { UtilityService } from "@/provider/utility.service";

import { MQTTController } from "./mqtt.controller";
import { MQTTService } from "./mqtt.service";

@Module({
    controllers: [MQTTController],
    providers: [ConfigService, UtilityService, MQTTService],
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
