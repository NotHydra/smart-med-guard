import { BadRequestException, Injectable } from "@nestjs/common";

import { ConfigService } from "@/config/config.service";

import { MESSAGE } from "@/common/constant/message";
import { SuccessResponseInterface } from "@/common/interface/response.interface";

import { OrderDirectionEnum } from "@/common/enum/order-direction.enum";
import { LoggerService } from "./logger.service";

@Injectable()
export class UtilityService {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly configService: ConfigService //
    ) {
        this.loggerService = new LoggerService(UtilityService.name);
    }

    public capitalize(
        text: string //
    ): string {
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

    public pretty(
        json: any //
    ): string {
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

    public validateOrderBy<E extends Record<string, any>>(
        orderByEnum: E, //
        orderByValue: keyof E | undefined
    ) {
        if (orderByValue !== undefined && !Object.values(orderByEnum).includes(orderByValue)) {
            throw new BadRequestException(`Invalid orderBy value. Must be one of: ${Object.values(orderByEnum).join(", ")}`);
        }
    }

    public validateOrderDirection(
        orderDirection: OrderDirectionEnum | undefined //
    ) {
        if (orderDirection !== undefined && !Object.values(OrderDirectionEnum).includes(orderDirection)) {
            throw new BadRequestException(`Invalid orderDirection value. Must be one of: ${Object.values(OrderDirectionEnum).join(", ")}`);
        }
    }

    public generateSuccessResponse<T>({
        status, //
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

    public generateFileURL({
        filePath, //
    }: {
        filePath: string;
    }): string {
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

        const result: string = `${this.configService.getURL()}/${filePath}`;

        this.loggerService.verbose({
            message: `${MESSAGE.GENERAL.RESULT}: ${result}`,
            addedContext: this.generateFileURL.name,
        });

        return result;
    }

    public convertToISO8601(
        timestamp: string //
    ): string {
        this.loggerService.verbose({
            message: MESSAGE.GENERAL.START,
            addedContext: this.convertToISO8601.name,
        });

        this.loggerService.verbose({
            message: `${MESSAGE.GENERAL.PARAMETER}: ${this.pretty({
                timestamp: timestamp,
            })}`,
            addedContext: this.convertToISO8601.name,
        });

        // Convert "YYYY-MM-DD HH:MM:SS" to ISO-8601 "YYYY-MM-DDTHH:MM:SS.000Z"
        const result: string = new Date(timestamp.replace(" ", "T") + "Z").toISOString();

        this.loggerService.verbose({
            message: `${MESSAGE.GENERAL.RESULT}: ${result}`,
            addedContext: this.convertToISO8601.name,
        });

        return result;
    }
}
