import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { MESSAGE } from "@/common/constant/message";

import { BcryptService } from "@/provider/bcrypt.service";
import { LoggerService } from "@/provider/logger.service";
import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

@Injectable()
export class UserService {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly bcryptService: BcryptService,
        private readonly utilityService: UtilityService,
        private readonly prisma: PrismaService
    ) {
        this.loggerService = new LoggerService(UserService.name);
    }

    public async find({
        page = 0,
        count = 0,
        cursor,
        where,
        orderBy,
    }: {
        page?: number;
        count?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.find.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    page: page,
                    count: count,
                    cursor: cursor,
                    where: where,
                    orderBy: orderBy,
                })}`,
                addedContext: this.find.name,
            });

            const models: User[] =
                page !== 0 && count !== 0
                    ? await this.prisma.user.findMany({
                          skip: (page - 1) * count,
                          take: count,
                          cursor: cursor,
                          where: where,
                          orderBy: orderBy,
                      })
                    : await this.prisma.user.findMany({
                          cursor: cursor,
                          where: where,
                          orderBy: orderBy,
                      });

            this.loggerService.log({
                message: `${MESSAGE.GENERAL.RESULT}: ${this.utilityService.pretty({
                    models: models,
                })}`,
                addedContext: this.find.name,
            });

            return models;
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.find.name,
            });

            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    public async findUnique({ where }: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.findUnique.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    where: where,
                })}`,
                addedContext: this.findUnique.name,
            });

            const model: User | null = await this.prisma.user.findUnique({
                where: where,
            });

            if (model === null) {
                throw new NotFoundException("Model Not Found");
            }

            this.loggerService.log({
                message: `${MESSAGE.GENERAL.RESULT}: ${this.utilityService.pretty({
                    model: model,
                })}`,
                addedContext: this.findUnique.name,
            });

            return model;
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.findUnique.name,
            });

            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    public async add({ data }: { data: Prisma.UserCreateInput }): Promise<User> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.add.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    data: data,
                })}`,
                addedContext: this.add.name,
            });

            const model: User = await this.prisma.user.create({
                data: {
                    ...data,
                    password: await this.bcryptService.hash({
                        plainValue: data.password,
                    }),
                },
            });

            this.loggerService.log({
                message: `${MESSAGE.GENERAL.RESULT}: ${this.utilityService.pretty({
                    model: model,
                })}`,
                addedContext: this.add.name,
            });

            return model;
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.add.name,
            });

            if (error instanceof BadRequestException) {
                throw error;
            }

            if (error instanceof PrismaClientKnownRequestError) {
                throw new BadRequestException("Invalid Payload");
            }

            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    public async change({
        where,
        data,
    }: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.change.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    where: where,
                    data: data,
                })}`,
                addedContext: this.change.name,
            });

            const model: User = await this.prisma.user.update({
                where: where,
                data: {
                    ...data,
                    password:
                        data.password !== undefined && typeof data.password === "string"
                            ? await this.bcryptService.hash({
                                  plainValue: data.password,
                              })
                            : undefined,
                },
            });

            this.loggerService.log({
                message: `${MESSAGE.GENERAL.RESULT}: ${this.utilityService.pretty({
                    model: model,
                })}`,
                addedContext: this.change.name,
            });

            if (model === null) {
                throw new NotFoundException("Model Not Found");
            }

            return model;
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.change.name,
            });

            if (error instanceof PrismaClientKnownRequestError) {
                throw new NotFoundException("Model Not Found");
            }

            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    public async remove({ where }: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.remove.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    where: where,
                })}`,
                addedContext: this.remove.name,
            });

            const model: User = await this.prisma.user.delete({
                where: where,
            });

            if (model === null) {
                throw new NotFoundException("Model Not Found");
            }

            this.loggerService.log({
                message: `${MESSAGE.GENERAL.RESULT}: ${this.utilityService.pretty({
                    model: model,
                })}`,
                addedContext: this.remove.name,
            });

            return model;
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.remove.name,
            });

            if (error instanceof PrismaClientKnownRequestError) {
                throw new NotFoundException("Model Not Found");
            }

            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new InternalServerErrorException("Internal Server Error");
        }
    }
}
