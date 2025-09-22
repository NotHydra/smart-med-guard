import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import * as _ from "lodash";
import { isArray, isObject } from "lodash";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

const toSnakeCase = (
    obj: any //
): any => {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (obj instanceof Date) {
        return obj;
    }

    if (isArray(obj)) {
        return obj.map((v) => toSnakeCase(v));
    }

    if (isObject(obj) && !Buffer.isBuffer(obj)) {
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
            result[_.snakeCase(key)] = toSnakeCase(value);
        }

        return result;
    }

    return obj;
};

@Injectable()
export class SnakeCaseConversionInterceptor implements NestInterceptor {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService //
    ) {
        this.loggerService = new LoggerService(SnakeCaseConversionInterceptor.name);
    }

    intercept(
        context: ExecutionContext, //
        next: CallHandler
    ): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                const formattedResponse: any = toSnakeCase(data);

                this.loggerService.log({
                    message: `${MESSAGE.GENERAL.FORMATTED_RESPONSE}: ${this.utilityService.pretty({
                        formattedResponse: formattedResponse,
                    })}`,
                    addedContext: `${context.getClass().name} -> ${context.getHandler().name}`,
                });

                return formattedResponse;
            })
        );
    }
}
