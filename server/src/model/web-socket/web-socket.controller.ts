import { Controller, Get, HttpStatus } from "@nestjs/common";

import { MESSAGE } from "@/common/constant/message";
import { SuccessResponseInterface } from "@/common/interface/response.interface";

import { WebSocketService } from "@/model/web-socket/web-socket.service";
import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

@Controller("web-socket")
export class WebSocketController {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService,
        private readonly webSocketService: WebSocketService
    ) {
        this.loggerService = new LoggerService(WebSocketController.name);
    }

    @Get("publish/greet")
    public publishGreet(): SuccessResponseInterface<null> {
        try {
            this.loggerService.log({
                message: `${MESSAGE.GENERAL.START}`,
                addedContext: this.publishGreet.name,
            });

            this.webSocketService.publishGreet();

            return this.utilityService.generateSuccessResponse<null>({
                status: HttpStatus.OK,
                message: "Published",
                data: null,
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.publishGreet.name,
            });

            throw error;
        }
    }
}
