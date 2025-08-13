import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { ConfigService } from "@/config/config.service";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "./logger.service";
import { UtilityService } from "./utility.service";

@Injectable()
export class BcryptService {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly configService: ConfigService,
        private readonly utilityService: UtilityService
    ) {
        this.loggerService = new LoggerService(BcryptService.name);
    }

    public async hash({ plainValue }: { plainValue: string }): Promise<string> {
        this.loggerService.verbose({
            message: MESSAGE.GENERAL.START,
            addedContext: this.hash.name,
        });

        this.loggerService.verbose({
            message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({ plainValue })}`,
            addedContext: this.hash.name,
        });

        const result: string = await bcrypt.hash(plainValue, this.configService.getBcryptSaltRounds());

        this.loggerService.verbose({
            message: `${MESSAGE.GENERAL.RESULT}: ${result}`,
            addedContext: this.hash.name,
        });

        return result;
    }

    public async compare({ plainValue, hashedValue }: { plainValue: string; hashedValue: string }): Promise<boolean> {
        this.loggerService.verbose({
            message: MESSAGE.GENERAL.START,
            addedContext: this.compare.name,
        });

        this.loggerService.verbose({
            message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                plainValue: plainValue,
                hashedValue: hashedValue,
            })}`,
            addedContext: this.compare.name,
        });

        const result: boolean = await bcrypt.compare(plainValue, hashedValue);

        this.loggerService.verbose({
            message: `${MESSAGE.GENERAL.RESULT}: ${result}`,
            addedContext: this.compare.name,
        });

        return result;
    }
}
