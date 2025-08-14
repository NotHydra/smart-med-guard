import { Module } from "@nestjs/common";

import { ConfigService } from "@/config/config.service";

import { UtilityService } from "@/provider/utility.service";

import { WebSocketController } from "./web-socket.controller";
import { WebSocketService } from "./web-socket.service";

@Module({
    controllers: [WebSocketController],
    providers: [ConfigService, UtilityService, WebSocketService],
    imports: [],
    exports: [],
})
export class WebSocketModule {}
