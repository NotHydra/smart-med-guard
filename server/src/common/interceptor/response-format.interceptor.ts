import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { MESSAGE } from "@/common/constant/message";
import { FormattedResponseInterface, SuccessResponseInterface } from "@/common/interface/response.interface";

import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

@Injectable()
export class ResponseFormatInterceptor<T> implements NestInterceptor<T, FormattedResponseInterface<T>> {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService //
    ) {
        this.loggerService = new LoggerService(ResponseFormatInterceptor.name);
    }

    intercept(
        context: ExecutionContext, //
        next: CallHandler
    ): Observable<FormattedResponseInterface<T>> {
        return next.handle().pipe(
            map((successResponse: SuccessResponseInterface<T>): FormattedResponseInterface<T> => {
                const formattedResponse: FormattedResponseInterface<T> = {
                    success: true,
                    status: successResponse.status,
                    message: successResponse.message,
                    data: successResponse.data,
                    timestamp: new Date().toISOString(),
                };

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
