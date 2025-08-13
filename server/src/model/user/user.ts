import { IsEmail, IsOptional, IsString } from "class-validator";

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
