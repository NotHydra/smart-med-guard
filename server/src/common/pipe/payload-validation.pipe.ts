import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ValidationError } from "class-validator";

import { PayloadValidationException } from "@/common/exception/payload-validation.exception";
import { PayloadValidationExceptionData } from "@/common/interface/exception.interface";

export class PayloadValidationPipe extends ValidationPipe {
    constructor() {
        super({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            exceptionFactory: (errors: ValidationError[]): BadRequestException => {
                return new PayloadValidationException(
                    errors.map(
                        (error: ValidationError): PayloadValidationExceptionData => ({
                            field: error.property,
                            errors: error.constraints ? Object.values(error.constraints) : [],
                        })
                    )
                );
            },
        });
    }
}
