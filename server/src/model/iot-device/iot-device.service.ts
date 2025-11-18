import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { IoTDevice, Prisma } from "@prisma/client";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "@/provider/logger.service";
import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

import { AvailableIoTDevice } from "./iot-device";

@Injectable()
export class IoTDeviceService {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService,
        private readonly prisma: PrismaService
    ) {
        this.loggerService = new LoggerService(IoTDeviceService.name);
    }

    public async findAvailable(): Promise<AvailableIoTDevice[]> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.findAvailable.name,
            });

            const models = await this.prisma.ioTDevice.findMany({
                select: {
                    id: true,
                    agency: true,
                    floor: true,
                    room: true,
                },
            });

            this.loggerService.log({
                message: `${MESSAGE.GENERAL.RESULT}: ${this.utilityService.pretty({
                    models: models,
                })}`,
                addedContext: this.findAvailable.name,
            });

            return models;
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.findAvailable.name,
            });

            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    public async findUniqueWithLatestAndPreviousData({
        where, //
    }: {
        where: Prisma.IoTDeviceWhereUniqueInput;
    }) {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.findUniqueWithLatestAndPreviousData.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    where: where,
                })}`,
                addedContext: this.findUniqueWithLatestAndPreviousData.name,
            });

            const model = await this.prisma.ioTDevice.findUnique({
                where: where,
                select: {
                    temperatureReadings: {
                        select: {
                            value: true,
                            timestamp: true,
                        },
                        take: 10,
                        orderBy: {
                            timestamp: "desc",
                        },
                    },
                    humidityReadings: {
                        select: {
                            value: true,
                            timestamp: true,
                        },
                        take: 10,
                        orderBy: {
                            timestamp: "desc",
                        },
                    },
                    occupancyReadings: {
                        select: {
                            value: true,
                        },
                        take: 1,
                    },
                },
            });

            if (model === null) {
                throw new NotFoundException("Model Not Found");
            }

            this.loggerService.log({
                message: `${MESSAGE.GENERAL.RESULT}: ${this.utilityService.pretty({
                    model: model,
                })}`,
                addedContext: this.findUniqueWithLatestAndPreviousData.name,
            });

            return model;
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.findUniqueWithLatestAndPreviousData.name,
            });

            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    public async findOrCreate({
        agency, //
        floor,
        room,
        timestamp,
    }: {
        agency: string;
        floor: number;
        room: string;
        timestamp: string;
    }): Promise<IoTDevice> {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.findOrCreate.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    agency: agency,
                    floor: floor,
                    room: room,
                    timestamp: timestamp,
                })}`,
                addedContext: this.findOrCreate.name,
            });

            let model: IoTDevice | null = await this.prisma.ioTDevice.findUnique({
                where: {
                    agency_floor_room: {
                        agency: agency,
                        floor: floor,
                        room: room,
                    },
                },
            });

            if (model === null) {
                try {
                    model = await this.prisma.ioTDevice.create({
                        data: {
                            agency: agency,
                            floor: floor,
                            room: room,
                            createdAt: this.utilityService.convertToISO8601(timestamp),
                            updatedAt: this.utilityService.convertToISO8601(timestamp),
                        },
                    });

                    this.loggerService.log({
                        message: `${MESSAGE.GENERAL.ADD}: ${this.utilityService.pretty({
                            model: model,
                        })}`,
                        addedContext: this.findOrCreate.name,
                    });

                    return model;
                } catch (error) {
                    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                        model = await this.prisma.ioTDevice.findUnique({
                            where: {
                                agency_floor_room: {
                                    agency: agency,
                                    floor: floor,
                                    room: room,
                                },
                            },
                        });

                        if (model === null) {
                            throw new InternalServerErrorException("Failed to find or create IoT device");
                        }
                    } else {
                        throw error;
                    }
                }
            }

            this.loggerService.log({
                message: `${MESSAGE.GENERAL.FIND_ONE}: ${this.utilityService.pretty({
                    device: model,
                })}`,
                addedContext: this.findOrCreate.name,
            });

            return model;
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.findOrCreate.name,
            });

            throw new InternalServerErrorException("Internal Server Error");
        }
    }
}
