import { Controller, Get, HttpStatus } from "@nestjs/common";

import { MESSAGE } from "@/common/constant/message";
import { SuccessResponseInterface } from "@/common/interface/response.interface";

import { LoggerService } from "@/provider/logger.service";
import { UtilityService } from "@/provider/utility.service";

import { AvailableIoTDevice } from "./iot-device";
import { IoTDeviceService } from "./iot-device.service";

@Controller("iot-device")
export class IoTDeviceController {
    private readonly loggerService: LoggerService;

    constructor(
        private readonly utilityService: UtilityService,
        private readonly iotDeviceService: IoTDeviceService
    ) {
        this.loggerService = new LoggerService(IoTDeviceController.name);
    }

    @Get("find/available")
    public async findAvailable(): Promise<SuccessResponseInterface<AvailableIoTDevice[]>> {
        try {
            this.loggerService.log({
                message: MESSAGE.GENERAL.START,
                addedContext: this.findAvailable.name,
            });

            return this.utilityService.generateSuccessResponse<AvailableIoTDevice[]>({
                status: HttpStatus.OK,
                message: MESSAGE.GENERAL.FIND,
                data: await this.iotDeviceService.findAvailable(),
            });
        } catch (error) {
            this.loggerService.error({
                message: `${MESSAGE.GENERAL.ERROR}: ${error.message}`,
                addedContext: this.findAvailable.name,
            });

            throw error;
        }
    }
}
