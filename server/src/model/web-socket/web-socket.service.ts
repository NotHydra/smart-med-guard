import { InternalServerErrorException } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
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

import { IoTDeviceService } from "@/model/iot-device/iot-device.service";

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

    constructor(
        private readonly utilityService: UtilityService,
        private readonly iotDeviceService: IoTDeviceService
    ) {
        this.loggerService = new LoggerService(WebSocketService.name);
    }

    public handleConnection(client: Socket, ...args: any[]) {
        try {
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
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.handleConnection.name,
            });

            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    public handleDisconnect(client: Socket) {
        try {
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
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.handleDisconnect.name,
            });

            throw new InternalServerErrorException("Internal Server Error");
        }
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
        try {
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
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.subscribeHello.name,
            });

            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    @SubscribeMessage("iot-device-topic-join")
    public async subscribeIoTDeviceTopicJoin(@ConnectedSocket() client: Socket, @MessageBody() iotDeviceId: string) {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.subscribeIoTDeviceTopicJoin.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    clientId: client.id,
                    iotDeviceId: iotDeviceId,
                })}`,
                addedContext: this.subscribeIoTDeviceTopicJoin.name,
            });

            const iotDevice = await this.iotDeviceService.findUniqueWithLatestAndPreviousData({
                where: {
                    id: iotDeviceId,
                },
            });

            const topic: string = `iot-device-${iotDeviceId}`;
            client.join(topic);

            if (
                iotDevice.temperatureReadings?.[0] &&
                iotDevice.humidityReadings?.[0] &&
                iotDevice.occupancyReadings?.[0]
            ) {
                client.emit("new", {
                    temperature: iotDevice.temperatureReadings[0].temperature,
                    humidity: iotDevice.humidityReadings[0].humidity,
                    occupancy: iotDevice.occupancyReadings[0].occupancy,
                });
            }

            if (iotDevice.temperatureReadings?.length > 1 && iotDevice.humidityReadings?.length > 1) {
                client.emit("history", {
                    temperature: iotDevice.temperatureReadings.slice(1),
                    humidity: iotDevice.humidityReadings.slice(1),
                });
            }

            this.loggerService.log({
                message: `${MESSAGE.GENERAL.RESULT}: ${this.utilityService.pretty({
                    topic: topic,
                    iotDevice: iotDevice,
                })}`,
                addedContext: this.subscribeIoTDeviceTopicJoin.name,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.subscribeIoTDeviceTopicJoin.name,
            });

            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    @SubscribeMessage("iot-device-topic-leave")
    public subscribeIoTDeviceTopicLeave(@ConnectedSocket() client: Socket, @MessageBody() iotDeviceId: string): void {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.subscribeIoTDeviceTopicLeave.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    clientId: client.id,
                    iotDeviceId: iotDeviceId,
                })}`,
                addedContext: this.subscribeIoTDeviceTopicLeave.name,
            });

            const topic: string = `iot-device/${iotDeviceId}`;
            client.leave(topic);

            this.loggerService.log({
                message: `${MESSAGE.GENERAL.RESULT}: ${this.utilityService.pretty({
                    topic: topic,
                })}`,
                addedContext: this.subscribeIoTDeviceTopicLeave.name,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.subscribeIoTDeviceTopicLeave.name,
            });

            throw new InternalServerErrorException("Internal Server Error");
        }
    }
}
