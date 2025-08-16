import { Module } from "@nestjs/common";

import { ConfigService } from "@/config/config.service";

import { BcryptService } from "@/provider/bcrypt.service";
import { PrismaService } from "@/provider/prisma.service";
import { UtilityService } from "@/provider/utility.service";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    controllers: [UserController],
    providers: [ConfigService, UtilityService, BcryptService, PrismaService, UserService],
    imports: [],
    exports: [UserService],
})
export class UserModule {}
