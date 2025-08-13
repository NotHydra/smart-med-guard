import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

import { AuthenticatedUser } from "./../auth";
import { AuthService } from "./../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService,
        private readonly authService: AuthService
    ) {
        super({
            usernameField: "email",
        });

        this.loggerService = new LoggerService(LocalStrategy.name);
    }

    public async validate(email: string, password: string): Promise<AuthenticatedUser> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.validate.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    email: email,
                    password: password,
                })}`,
                addedContext: this.validate.name,
            });

            return await this.authService.validate({
                email,
                password,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.validate.name,
            });

            throw error;
        }
    }
}
