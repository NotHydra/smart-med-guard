import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule, ConfigService as NestConfigService } from "@nestjs/config";

import config from "./config";
import { ConfigService } from "./config.service";
import { validate } from "./config.validation";

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [config],
            validate: validate,
            cache: true,
        }),
    ],
    exports: [
        NestConfigService, //
        ConfigService,
    ],
    providers: [
        NestConfigService, //
        ConfigService,
    ],
})
export class ConfigModule {}
