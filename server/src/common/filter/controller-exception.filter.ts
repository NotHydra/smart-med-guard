import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

import { MESSAGE } from "@/common/constant/message";
import { PayloadValidationException } from "@/common/exception/payload-validation.exception";
import { FormattedResponseInterface } from "@/common/interface/response.interface";

import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

@Catch(HttpException)
export class ControllerExceptionFilter implements ExceptionFilter {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService //
    ) {
        this.loggerService = new LoggerService(ControllerExceptionFilter.name);
    }

    catch(
        exception: HttpException | PayloadValidationException, //
        host: ArgumentsHost
    ): void {
        this.loggerService.debug({
            message: `${MESSAGE.GENERAL.PARAMETER}: ${this.utilityService.pretty({
                exception: exception,
            })}`,
        });

        const response: FormattedResponseInterface<any> = {
            success: false,
            status: exception.getStatus(),
            message: exception.message,
            data:
                exception instanceof PayloadValidationException //
                    ? exception.data
                    : null,
            timestamp: new Date().toISOString(),
        };

        this.loggerService.error({
            message: `${MESSAGE.GENERAL.RESPONSE}: ${this.utilityService.pretty({
                response: response,
            })}`,
        });

        host.switchToHttp().getResponse().status(response.status).json(response);
    }
}
