import { Controller, Get, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";

import { MESSAGE } from "@/common/constant/message";
import { SuccessResponseInterface } from "@/common/interface/response.interface";

import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

import { JWTAccessToken } from "./auth";
import { AuthService } from "./auth.service";
import { JWTAuthGuard } from "./guard/jwt-auth.guard";
import { LocalAuthGuard } from "./guard/local-auth.guard";

@Controller("auth")
export class AuthController {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService,
        private authService: AuthService
    ) {
        this.loggerService = new LoggerService(AuthController.name);
    }

    @UseGuards(LocalAuthGuard)
    @Post("login")
    public async login(@Request() req): Promise<SuccessResponseInterface<JWTAccessToken>> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.login.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    user: req.user,
                })}`,
                addedContext: this.login.name,
            });

            return this.utilityService.generateSuccessResponse<JWTAccessToken>({
                status: HttpStatus.OK,
                message: "Login successful",
                data: await this.authService.login(req.user),
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.login.name,
            });

            throw error;
        }
    }

    @UseGuards(JWTAuthGuard)
    @Get("profile")
    public async profile(@Request() req): Promise<SuccessResponseInterface<any>> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.profile.name,
            });

            this.loggerService.debug({
                message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                    user: req.user,
                })}`,
                addedContext: this.profile.name,
            });

            return this.utilityService.generateSuccessResponse<any>({
                status: HttpStatus.OK,
                message: MESSAGE.GENERAL.FIND,
                data: req.user,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.profile.name,
            });

            throw error;
        }
    }
}
