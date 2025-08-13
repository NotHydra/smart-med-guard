import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

import { ConfigModule } from "@/config/config.module";

import { BcryptService } from "@/provider/bcrypt.service";
import { UtilityService } from "@/provider/utility.service";

import { AuthModule } from "@/auth/auth.module";

import { UserModule } from "@/model/user/user.module";

import { AppController } from "./app.controller";

@Module({
    controllers: [AppController],
    providers: [UtilityService, BcryptService],
    imports: [
        ServeStaticModule.forRoot({
            serveRoot: "/public/upload",
            rootPath: join(__dirname, "../..", "public/upload"),
        }),
        ConfigModule,
        AuthModule,
        UserModule,
    ],
})
export class AppModule {}
