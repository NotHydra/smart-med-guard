import { Injectable, LogLevel } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";
import { extname } from "path";

const ONE_MB: number = 1024 * 1024;

@Injectable()
export class ConfigService {
    constructor(private readonly nestConfigService: NestConfigService) {}

    public getLogLevel(): LogLevel[] {
        return this.nestConfigService.get<LogLevel[]>("logLevel")!;
    }

    public getEnvironment(): string {
        return this.nestConfigService.get<string>("environment")!;
    }

    public getHost(): string {
        return this.nestConfigService.get<string>("host")!;
    }

    public getPort(): number {
        return this.nestConfigService.get<number>("port")!;
    }

    public getAPIKey(): string {
        return this.nestConfigService.get<string>("apiKey")!;
    }

    public getBcryptSaltRounds(): number {
        return this.nestConfigService.get<number>("bcryptSaltRounds")!;
    }

    public getJWTSecret(): string {
        return this.nestConfigService.get<string>("jwtSecret")!;
    }

    public getMQTTHost(): string {
        return this.nestConfigService.get<string>("mqttHost")!;
    }

    public getMQTTPort(): number {
        return this.nestConfigService.get<number>("mqttPort")!;
    }

    public isDevelopment(): boolean {
        return this.getEnvironment() === "development";
    }

    public isProduction(): boolean {
        return this.getEnvironment() === "production";
    }

    public getProtocol(): string {
        return this.isDevelopment() ? "http" : "https";
    }

    public getBaseURL(): string {
        return `${this.getProtocol()}://${this.getHost()}${this.isProduction() ? "" : `:${this.getPort()}`}`;
    }

    public getMQTTURL(): string {
        return `mqtt://${this.getMQTTHost()}:${this.getMQTTPort()}`;
    }

    public getMulterFileName() {
        return (req, file: Express.Multer.File, callback): void => {
            const uniqueSuffix: string = String(Math.round(Math.random() * 1e9));
            const fileExt: string = extname(file.originalname);
            const currentTime: string = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);

            const fileName: string = `${file.fieldname}/${currentTime}-${uniqueSuffix}${fileExt}`;

            callback(null, fileName);
        };
    }

    public getMulterImageFileFilter() {
        return (req, file, callback): void => {
            const allowedFileTypes: RegExp = /\.(jpg|jpeg|png|gif)$/i;
            if (!allowedFileTypes.test(extname(file.originalname))) {
                return callback(new Error("Only image files are allowed!"), false);
            }

            callback(null, true);
        };
    }

    public getMulterImageLimits() {
        return {
            fileSize: 20 * ONE_MB,
        };
    }
}
