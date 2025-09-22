import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { ConfigService } from "@/config/config.service";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

import { UserService } from "@/model/user/user.service";

import { User } from "@prisma/client";
import { AuthenticatedUser } from "../auth";

interface JWTPayload {
    sub: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly loggerService: LoggerService;

    constructor(
        readonly configService: ConfigService,
        private readonly utilityService: UtilityService,
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getJWTSecret(),
        });

        this.loggerService = new LoggerService(JwtStrategy.name);
    }

    public async validate(
        payload: JWTPayload //
    ): Promise<AuthenticatedUser> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.validate.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    userId: payload.sub,
                    email: payload.email,
                })}`,
                addedContext: this.validate.name,
            });

            const user: User = await this.userService.findUnique({
                where: {
                    id: payload.sub,
                },
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

            throw error;
        }
    }
}
