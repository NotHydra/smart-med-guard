import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";

import { MESSAGE } from "@/common/constant/message";

import { BcryptService } from "@/provider/bcrypt.service";
import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

import { UserService } from "@/model/user/user.service";

import { AuthenticatedUser, JWTAccessToken } from "./auth";

@Injectable()
export class AuthService {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly bcrypt: BcryptService,
        private readonly utilityService: UtilityService,
        private readonly jwtService: JwtService,
        private readonly usersService: UserService
    ) {
        this.loggerService = new LoggerService(AuthService.name);
    }

    public async validate({
        email, //
        password,
    }: {
        email: string;
        password: string;
    }): Promise<AuthenticatedUser> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.validate.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    email: email,
                })}`,
                addedContext: this.validate.name,
            });

            const user: User = await this.usersService.findUnique({
                where: {
                    email: email,
                },
            });

            this.loggerService.debug({
                message: `Found User: ${this.utilityService.pretty({
                    user: user,
                })}`,
                addedContext: this.validate.name,
            });

            if (
                (await this.bcrypt.compare({
                    plainValue: password,
                    hashedValue: user.password,
                })) === false
            ) {
                throw new UnauthorizedException("Invalid Credentials");
            }

            this.loggerService.log({
                message: "Result: User authenticated successfully",
                addedContext: this.validate.name,
            });

            return {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.validate.name,
            });

            if (error instanceof UnauthorizedException) {
                throw error;
            }

            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    public async login(
        user: AuthenticatedUser //
    ): Promise<JWTAccessToken> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.login.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    user: user,
                })}`,
                addedContext: this.login.name,
            });

            return {
                accessToken: this.jwtService.sign({
                    sub: user.id,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                }),
            };
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.login.name,
            });

            throw error;
        }
    }
}
