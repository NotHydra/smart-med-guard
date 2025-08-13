import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { ConfigService } from "@/config/config.service";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

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
        private readonly utilityService: UtilityService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getJWTSecret(),
        });

        this.loggerService = new LoggerService(JwtStrategy.name);
    }

    public async validate(payload: JWTPayload): Promise<AuthenticatedUser | undefined> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.validate.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    payload: payload,
                })}`,
                addedContext: this.validate.name,
            });

            return {
                id: payload.sub,
                email: payload.email,
                createdAt: payload.createdAt,
                updatedAt: payload.updatedAt,
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
