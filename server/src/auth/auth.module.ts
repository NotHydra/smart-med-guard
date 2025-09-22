import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { ConfigModule } from "@/config/config.module";
import { ConfigService } from "@/config/config.service";

import { BcryptService } from "@/provider/bcrypt.service";
import { UtilityService } from "@/provider/utility.service";

import { UserModule } from "@/model/user/user.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { LocalStrategy } from "./strategy/local.strategy";

@Module({
    controllers: [
        AuthController, //
    ],
    providers: [
        ConfigService, //
        BcryptService,
        UtilityService,
        LocalStrategy,
        JwtStrategy,
        AuthService,
    ],
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getJWTSecret(),
                signOptions: { expiresIn: "60m" },
            }),
        }),
        UserModule,
    ],
    exports: [
        PassportModule, //
        LocalStrategy,
        JwtStrategy,
        AuthService,
    ],
})
export class AuthModule {}
