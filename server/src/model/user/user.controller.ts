import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";

import { MESSAGE } from "@/common/constant/message";
import { SuccessResponseInterface } from "@/common/interface/response.interface";

import { JWTAuthGuard } from "@/auth/guard/jwt-auth.guard";

import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

import { UserCreateDTO, UserUpdateDTO } from "./user";
import { UserService } from "./user.service";

@UseGuards(JWTAuthGuard)
@Controller("user")
export class UserController {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService,
        private readonly userService: UserService
    ) {
        this.loggerService = new LoggerService(UserController.name);
    }

    @Get("find")
    public async find(
        @Query("page", new DefaultValuePipe(0), ParseIntPipe) page?: number,
        @Query("count", new DefaultValuePipe(0), ParseIntPipe) count?: number
    ): Promise<SuccessResponseInterface<User[]>> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.find.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    page: page,
                    count: count,
                })}`,
                addedContext: this.find.name,
            });

            return this.utilityService.generateSuccessResponse<User[]>({
                status: HttpStatus.OK,
                message: MESSAGE.GENERAL.FIND,
                data: await this.userService.find({
                    page: page,
                    count: count,
                }),
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.find.name,
            });

            throw error;
        }
    }

    @Get("find/id/:id")
    public async findById(@Param("id") id: string): Promise<SuccessResponseInterface<User>> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.findById.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    id: id,
                })}`,
                addedContext: this.findById.name,
            });

            return this.utilityService.generateSuccessResponse<User>({
                status: HttpStatus.OK,
                message: MESSAGE.GENERAL.FIND_ONE,
                data: await this.userService.findUnique({
                    where: { id: id },
                }),
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.findById.name,
            });

            throw error;
        }
    }

    @Post("/add")
    public async add(@Body() payload: UserCreateDTO): Promise<SuccessResponseInterface<null>> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.add.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    payload: payload,
                })}`,
                addedContext: this.add.name,
            });

            await this.userService.add({
                data: payload,
            });

            return this.utilityService.generateSuccessResponse<null>({
                status: HttpStatus.CREATED,
                message: MESSAGE.GENERAL.ADD,
                data: null,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.add.name,
            });

            throw error;
        }
    }

    @Put("change/id/:id")
    public async changeById(
        @Param("id") id: string,
        @Body() payload: UserUpdateDTO
    ): Promise<SuccessResponseInterface<null>> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.changeById.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    id: id,
                    payload: payload,
                })}`,
                addedContext: this.changeById.name,
            });

            await this.userService.change({
                where: { id: id },
                data: payload,
            });

            return this.utilityService.generateSuccessResponse<null>({
                status: HttpStatus.OK,
                message: MESSAGE.GENERAL.CHANGE_ONE,
                data: null,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.changeById.name,
            });

            throw error;
        }
    }

    @Delete("remove/id/:id")
    public async removeById(@Param("id") id: string): Promise<SuccessResponseInterface<null>> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.removeById.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    id: id,
                })}`,
                addedContext: this.removeById.name,
            });

            await this.userService.remove({
                where: { id: id },
            });

            return this.utilityService.generateSuccessResponse<null>({
                status: HttpStatus.OK,
                message: MESSAGE.GENERAL.REMOVE_ONE,
                data: null,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.removeById.name,
            });

            throw error;
        }
    }
}
