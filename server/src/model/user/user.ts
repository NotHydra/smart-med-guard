import { OrderDirectionEnum } from "@/common/enum/order-direction.enum";
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";

export enum UserOrderByEnum {
    ID = "id",
    EMAIL = "email",
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
}

export class UserSearchDTO {
    @IsString()
    @IsOptional()
    search?: string;

    @IsEnum(UserOrderByEnum)
    @IsOptional()
    orderBy?: UserOrderByEnum;

    @IsEnum(OrderDirectionEnum)
    @IsOptional()
    orderDirection?: OrderDirectionEnum;
}

export class UserCreateDTO {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class UserUpdateDTO {
    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;
}
