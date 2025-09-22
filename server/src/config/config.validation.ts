import { LogLevel, ValidationError } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { IsNumber, IsString, validateSync } from "class-validator";

class EnvironmentVariables {
    LOG_LEVEL: LogLevel[];

    @IsString()
    HOST: string;

    @IsNumber()
    PORT: number;

    @IsString()
    URL: string;

    @IsString()
    API_KEY: string;

    @IsString()
    BCRYPT_SALT_ROUNDS: string;

    @IsString()
    JWT_SECRET: string;

    @IsNumber()
    WEBSOCKET_PORT: number;

    @IsString()
    MQTT_HOST: string;

    @IsNumber()
    MQTT_PORT: number;
}

export function validate(
    config: Record<string, unknown> //
): EnvironmentVariables {
    const validatedConfig: EnvironmentVariables = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const errors: ValidationError[] = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }

    return validatedConfig;
}
