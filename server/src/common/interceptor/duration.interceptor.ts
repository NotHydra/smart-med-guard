import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

import { MESSAGE } from "@/common/constant/message";

import { LoggerService } from "@/provider/logger.service";

@Injectable()
export class DurationInterceptor implements NestInterceptor {
    private readonly loggerService: LoggerService;

    constructor() {
        this.loggerService = new LoggerService(DurationInterceptor.name);
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const start: number = Date.now();

        this.loggerService.debug({
            message: MESSAGE.GENERAL.START,
            addedContext: `${context.getClass().name} -> ${context.getHandler().name}`,
        });

        return next.handle().pipe(
            tap((): void => {
                return this.loggerService.debug({
                    message: `Finished In ${Date.now() - start}ms`,
                    addedContext: `${context.getClass().name} -> ${context.getHandler().name}`,
                });
            })
        );
    }
}
