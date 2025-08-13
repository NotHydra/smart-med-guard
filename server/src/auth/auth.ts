export class AuthenticatedUser {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface JWTAccessToken {
    accessToken: string;
}
