import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

import { HumidityReadingService } from "@/model/humidity-reading/humidity-reading.service";
import { OccupancyReadingService } from "@/model/occupancy-reading/occupancy-reading.service";
import { TemperatureReadingService } from "@/model/temperature-reading/temperature-reading.service";

@Injectable()
export class MQTTService {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService,
        private readonly temperatureReadingService: TemperatureReadingService,
        private readonly humidityReadingService: HumidityReadingService,
        private readonly occupancyReadingService: OccupancyReadingService,
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

    public async subscribeIoTDeviceTemperature({
        agency,
        floor,
        room,
        temperature,
    }: {
        agency: string;
        floor: string;
        room: string;
        temperature: number;
    }): Promise<void> {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.subscribeIoTDeviceTemperature.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    agency: agency,
                    floor: floor,
                    room: room,
                    temperature: temperature,
                })}`,
                addedContext: this.subscribeIoTDeviceTemperature.name,
            });

            await this.temperatureReadingService.add({
                agency: agency,
                floor: floor,
                room: room,
                temperature: temperature,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.subscribeIoTDeviceTemperature.name,
            });

            throw error;
        }
    }

    public async subscribeIoTDeviceHumidity({
        agency,
        floor,
        room,
        humidity,
    }: {
        agency: string;
        floor: string;
        room: string;
        humidity: number;
    }): Promise<void> {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.subscribeIoTDeviceHumidity.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    agency: agency,
                    floor: floor,
                    room: room,
                    humidity: humidity,
                })}`,
                addedContext: this.subscribeIoTDeviceHumidity.name,
            });

            await this.humidityReadingService.add({
                agency: agency,
                floor: floor,
                room: room,
                humidity: humidity,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.subscribeIoTDeviceHumidity.name,
            });

            throw error;
        }
    }

    public async subscribeIoTDeviceOccupancy({
        agency,
        floor,
        room,
        occupancy,
    }: {
        agency: string;
        floor: string;
        room: string;
        occupancy: boolean;
    }): Promise<void> {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.subscribeIoTDeviceOccupancy.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    agency: agency,
                    floor: floor,
                    room: room,
                    occupancy: occupancy,
                })}`,
                addedContext: this.subscribeIoTDeviceOccupancy.name,
            });

            await this.occupancyReadingService.add({
                agency: agency,
                floor: floor,
                room: room,
                occupancy: occupancy,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.subscribeIoTDeviceOccupancy.name,
            });

            throw error;
        }
    }
}
