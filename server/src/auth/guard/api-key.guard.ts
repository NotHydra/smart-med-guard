import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

import { ConfigService } from "@/config/config.service";

import { MESSAGE } from "@/common/constant/message";

import { BcryptService } from "@/provider/bcrypt.service";
import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

@Injectable()
export class ApiKeyGuard implements CanActivate {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly configService: ConfigService,
        private readonly bcryptService: BcryptService,
        private readonly utilityService: UtilityService
    ) {
        this.loggerService = new LoggerService(ApiKeyGuard.name);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest<Request>();
        const apiKey: string = request.headers["x-api-key"] as string;

        this.loggerService.debug({
            message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                apiKey: apiKey,
            })}`,
        });

        if (apiKey === undefined || apiKey === null || apiKey.trim() === "") {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: API Key is missing`,
            });

            throw new UnauthorizedException("API Key is missing");
        }

        const result: boolean = apiKey === this.configService.getAPIKey();

        if (result === false) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: Invalid API Key`,
            });

            throw new UnauthorizedException("Invalid API Key");
        }

        this.loggerService.debug({
            message: `${MESSAGE.GENERAL.RESULT}: ${result}`,
        });

        return true;
    }
}
