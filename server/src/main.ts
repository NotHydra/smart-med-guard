import { INestApplication, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { ConfigService } from "@/config/config.service";

import { ControllerExceptionFilter } from "@/common/filter/controller-exception.filter";
import { DurationInterceptor } from "@/common/interceptor/duration.interceptor";
import { ResponseFormatInterceptor } from "@/common/interceptor/response-format.interceptor";
import { SnakeCaseConversionInterceptor } from "@/common/interceptor/snake-case-conversion.interceptor";
import { PayloadValidationPipe } from "@/common/pipe/payload-validation.pipe";

import { UtilityService } from "@/provider/utility.service";

import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { ApiKeyGuard } from "./auth/guard/api-key.guard";
import { BcryptService } from "./provider/bcrypt.service";

async function bootstrap(): Promise<void> {
    const app: INestApplication<AppModule> = await NestFactory.create<INestApplication<AppModule>>(AppModule);

    const configService: ConfigService = app.get(ConfigService);
    const bcryptService: BcryptService = app.get(BcryptService);
    const utilityService: UtilityService = app.get(UtilityService);

    const globalPrefix: string = "api";

    app.enableCors({
        allowedHeaders: "*",
        origin: "*",
        methods: "*",
    });

    app.setGlobalPrefix(globalPrefix, {
        exclude: [""],
    });

    app.useLogger(configService.getLogLevel());
    app.useGlobalGuards(new ApiKeyGuard(configService, bcryptService, utilityService));
    app.useGlobalFilters(new ControllerExceptionFilter(utilityService));
    app.useGlobalPipes(new PayloadValidationPipe());
    app.useGlobalInterceptors(
        new DurationInterceptor(),
        new ResponseFormatInterceptor(utilityService),
        new SnakeCaseConversionInterceptor(utilityService)
    );

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.MQTT,
        options: {
            url: "mqtt://localhost:1883",
        },
    });

    await app.startAllMicroservices();
    await app.listen(configService.getPort(), configService.getNetwork());

    Logger.log(`⚙️  Environment: ${utilityService.capitalize(configService.getEnvironment())}`);
    Logger.log(
        `🛠️  Log Level: [${configService
            .getLogLevel()
            .map((level: string) => utilityService.capitalize(level))
            .join(", ")}]`
    );
    Logger.log(`🚀 Application: ${configService.getBaseURL()}/${globalPrefix}`);
}

bootstrap();
