import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { IoTDevice } from "@prisma/client";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

import { HumidityReadingService } from "@/model/humidity-reading/humidity-reading.service";
import { IoTDeviceService } from "@/model/iot-device/iot-device.service";
import { OccupancyReadingService } from "@/model/occupancy-reading/occupancy-reading.service";
import { TemperatureReadingService } from "@/model/temperature-reading/temperature-reading.service";
import { WebSocketService } from "@/model/web-socket/web-socket.service";

@Injectable()
export class MQTTService {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService,
        private readonly iotDeviceService: IoTDeviceService,
        private readonly temperatureReadingService: TemperatureReadingService,
        private readonly humidityReadingService: HumidityReadingService,
        private readonly occupancyReadingService: OccupancyReadingService,
        private readonly webSocketService: WebSocketService,
        @Inject("MQTT_SERVICE") private client: ClientProxy
    ) {
        this.loggerService = new LoggerService(MQTTService.name);
    }

    public publishGreet(): null {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.publishGreet.name,
            });

            const topic: string = "hello";
            const payload: { message: string } = { message: `Hello from NestJS at ${new Date().toISOString()}` };

            this.client.emit(topic, JSON.stringify(payload));

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

    public async subscribeIoTDevice({
        agency,
        floor,
        room,
        temperature,
        humidity,
        occupancy,
    }: {
        agency: string;
        floor: string;
        room: string;
        temperature: number;
        humidity: number;
        occupancy: boolean;
    }): Promise<void> {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.subscribeIoTDevice.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    agency: agency,
                    floor: floor,
                    room: room,
                    temperature: temperature,
                    humidity: humidity,
                    occupancy: occupancy,
                })}`,
                addedContext: this.subscribeIoTDevice.name,
            });

            const iotDevice: IoTDevice = await this.iotDeviceService.findOrCreate({
                agency: agency,
                floor: floor,
                room: room,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.RESULT}: ${this.utilityService.pretty({
                    iotDevice: iotDevice,
                })}`,
                addedContext: this.subscribeIoTDevice.name,
            });

            const [temperatureReading, humidityReading, occupancyReading] = await Promise.all([
                this.temperatureReadingService.add({
                    iotDeviceId: iotDevice.id,
                    temperature: temperature,
                }),

                this.humidityReadingService.add({
                    iotDeviceId: iotDevice.id,
                    humidity: humidity,
                }),

                this.occupancyReadingService.add({
                    iotDeviceId: iotDevice.id,
                    occupancy: occupancy,
                }),
            ]);

            const topic: string = `iot-device-${iotDevice.id}`;

            this.loggerService.debug({
                message: `Emit (${topic}/new): Start`,
                addedContext: this.subscribeIoTDevice.name,
            });

            this.webSocketService.server.to(topic).emit("new", {
                temperature: {
                    value: temperatureReading.temperature,
                    timestamp: temperatureReading.timestamp,
                },
                humidity: {
                    value: humidityReading.humidity,
                    timestamp: humidityReading.timestamp,
                },
                occupancy: {
                    value: occupancyReading.occupancy,
                },
            });

            this.loggerService.debug({
                message: `Emit (${topic}/new): Finished`,
                addedContext: this.subscribeIoTDevice.name,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.subscribeIoTDevice.name,
            });

            throw error;
        }
    }
}
