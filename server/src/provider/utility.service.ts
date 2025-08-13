import { Injectable } from "@nestjs/common";

import { ConfigService } from "@/config/config.service";

import { MESSAGE } from "@/common/constant/message";
import { SuccessResponseInterface } from "@/common/interface/response.interface";

import { LoggerService } from "./logger.service";

@Injectable()
export class UtilityService {
    private readonly loggerService: LoggerService;

    constructor(private readonly configService: ConfigService) {
        this.loggerService = new LoggerService(UtilityService.name);
    }

    public capitalize(text: string): string {
        this.loggerService.verbose({
            message: MESSAGE.GENERAL.START,
            addedContext: this.capitalize.name,
        });

        this.loggerService.verbose({
            message: `${MESSAGE.GENERAL.PARAMETER}: ${this.pretty({
                text: text,
            })}`,
            addedContext: this.capitalize.name,
        });

        const result: string = text.charAt(0).toUpperCase() + text.slice(1);

        this.loggerService.verbose({
            message: `${MESSAGE.GENERAL.RESULT}: ${result}`,
            addedContext: this.capitalize.name,
        });

        return result;
    }

    public pretty(json: any): string {
        this.loggerService.verbose({
            message: MESSAGE.GENERAL.START,
            addedContext: this.pretty.name,
        });

        this.loggerService.verbose({
            message: `${MESSAGE.GENERAL.PARAMETER}: ${JSON.stringify(
                {
                    json: json,
                },
                null,
                2
            )}`,
            addedContext: this.pretty.name,
        });

        const result: string = JSON.stringify(json, null, 2);

        this.loggerService.verbose({
            message: `${MESSAGE.GENERAL.RESULT}: ${result}`,
            addedContext: this.pretty.name,
        });

        return result;
    }

    public generateSuccessResponse<T>({
        status,
        message,
        data,
    }: {
        status: number;
        message: string;
        data: T;
    }): SuccessResponseInterface<T> {
        this.loggerService.verbose({
            message: MESSAGE.GENERAL.START,
            addedContext: this.generateSuccessResponse.name,
        });

        this.loggerService.verbose({
            message: `${MESSAGE.GENERAL.PARAMETER}: ${this.pretty({
                status: status,
                message: message,
                data: data,
            })}`,
            addedContext: this.generateSuccessResponse.name,
        });

        const result: SuccessResponseInterface<T> = {
            status: status,
            message: message,
            data: data,
        };

        this.loggerService.verbose({
            message: `${MESSAGE.GENERAL.RESULT}: ${this.pretty(result)}`,
            addedContext: this.generateSuccessResponse.name,
        });

        return result;
    }

    public generateFileURL({ filePath }: { filePath: string }): string {
        this.loggerService.verbose({
            message: MESSAGE.GENERAL.START,
            addedContext: this.generateFileURL.name,
        });

        this.loggerService.verbose({
            message: `${MESSAGE.GENERAL.PARAMETER}: ${this.pretty({
                filePath: filePath,
            })}`,
            addedContext: this.generateFileURL.name,
        });

        const result: string = `${this.configService.getBaseURL()}/${filePath}`;

        this.loggerService.verbose({
            message: `${MESSAGE.GENERAL.RESULT}: ${result}`,
            addedContext: this.generateFileURL.name,
        });

        return result;
    }
}
