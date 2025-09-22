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
                enableCircularCheck: true,
            },
            validateCustomDecorators: true,
            exceptionFactory: (
                errors: ValidationError[] //
            ): BadRequestException => {
                const flattenErrors: (errors: ValidationError[], prefix?: string) => PayloadValidationExceptionData[] = (errors: ValidationError[], prefix = ""): PayloadValidationExceptionData[] => {
                    const result: PayloadValidationExceptionData[] = [];

                    for (const error of errors) {
                        const fieldName: string = prefix //
                            ? `${prefix}.${error.property}`
                            : error.property;

                        if (error.constraints) {
                            result.push({
                                field: fieldName,
                                errors: Object.values(error.constraints),
                            });
                        }

                        if (error.children && error.children.length > 0) {
                            result.push(...flattenErrors(error.children, fieldName));
                        }
                    }

                    return result;
                };

                return new PayloadValidationException(flattenErrors(errors));
            },
        });
    }
}
