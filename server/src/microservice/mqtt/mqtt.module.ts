import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { ConfigService } from "@/config/config.service";

import { UtilityService } from "@/provider/utility.service";

import { MQTTController } from "./mqtt.controller";
import { MQTTService } from "./mqtt.service";

@Module({
    controllers: [MQTTController],
    providers: [ConfigService, UtilityService, MQTTService],
    imports: [
        ClientsModule.register([
            {
                name: "MQTT_SERVICE",
                transport: Transport.MQTT,
                options: {
                    url: "mqtt://localhost:1883",
                },
            },
        ]),
    ],
    exports: [],
})
export class MQTTModule {}
