import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class AuthenticatedUser {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface JWTAccessToken {
    accessToken: string;
}

export class AuthLoginDTO {
    @IsEmail({}, { message: "Please provide a valid email address" })
    email: string;

    @IsString({ message: "Password must be a string" })
    @MinLength(1, { message: "Password is required" })
    @MaxLength(128, { message: "Password must not exceed 128 characters" })
    password: string;
}
