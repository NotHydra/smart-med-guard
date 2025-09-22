import { BadRequestException } from "@nestjs/common";

import { PayloadValidationExceptionData } from "@/common/interface/exception.interface";

export class PayloadValidationException extends BadRequestException {
    public readonly data: PayloadValidationExceptionData[];

    constructor(
        data: PayloadValidationExceptionData[] //
    ) {
        super("Payload Validation Failed");

        this.data = data;
    }
}
