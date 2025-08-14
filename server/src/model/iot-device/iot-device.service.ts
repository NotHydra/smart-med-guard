import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { IoTDevice, Prisma } from "@prisma/client";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "@/provider/logger.service";
import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

@Injectable()
export class IoTDeviceService {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService,
        private readonly prisma: PrismaService
    ) {
        this.loggerService = new LoggerService(IoTDeviceService.name);
    }

    public async findOrCreate({
        agency,
        floor,
        room,
    }: {
        agency: string;
        floor: string;
        room: string;
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
