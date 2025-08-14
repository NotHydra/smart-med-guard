import { InternalServerErrorException } from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway as WSGateway,
    WebSocketServer as WSServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

@WSGateway(parseInt(process.env.WEBSOCKET_PORT || "3002"), {
    cors: {
        origin: "*",
    },
    transports: ["websocket"],
})
export class WebSocketService implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly loggerService: LoggerService = new LoggerService(WebSocketService.name);

    @WSServer()
    public readonly server: Server;

    constructor(private readonly utilityService: UtilityService) {
        this.loggerService = new LoggerService(WebSocketService.name);
    }

    public handleConnection(client: Socket, ...args: any[]) {
        this.loggerService.log({
            message: `${MESSAGE.GENERAL.START}`,
            addedContext: this.handleConnection.name,
        });

        this.loggerService.log({
            message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                clientId: client.id,
            })}`,
            addedContext: this.handleConnection.name,
        });
    }

    public handleDisconnect(client: Socket) {
        this.loggerService.log({
            message: `${MESSAGE.GENERAL.START}`,
            addedContext: this.handleDisconnect.name,
        });

        this.loggerService.log({
            message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                clientId: client.id,
            })}`,
            addedContext: this.handleDisconnect.name,
        });
    }

    public publishGreet(): null {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.publishGreet.name,
            });

            const topic: string = "hello";
            const payload: { message: string } = { message: `Hello from NestJS at ${new Date().toISOString()}` };

            this.server.emit(topic, JSON.stringify(payload));

            this.loggerService.log({
                message: `${MESSAGE.GENERAL.RESULT}: ${this.utilityService.pretty({
                    topic: topic,
                    payload: this.utilityService.pretty(payload),
                })}`,
                addedContext: this.publishGreet.name,
            });

            return null;
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.publishGreet.name,
            });

            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    @SubscribeMessage("hello")
    public subscribeHello(client: Socket, payload: any): void {
        this.loggerService.log({
            message: `${MESSAGE.GENERAL.START}`,
            addedContext: this.subscribeHello.name,
        });

        this.loggerService.debug({
            message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                clientId: client.id,
                payload: payload,
            })}`,
            addedContext: this.subscribeHello.name,
        });
    }
}
