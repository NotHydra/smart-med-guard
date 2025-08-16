import { LogLevel } from "@nestjs/common";

export default (): {
    logLevel: LogLevel[];
    environment: string;
    host: string;
    port: number;
    apiKey: string;
    bcryptSaltRounds: number;
    jwtSecret: string;
    webSocketPort: number;
    mqttHost: string;
    mqttPort: number;
} => {
    if (process.env.LOG_LEVEL === undefined) {
        throw new Error("LOG_LEVEL environment variable is not set");
    }

    if (process.env.ENVIRONMENT === undefined) {
        throw new Error("ENVIRONMENT environment variable is not set");
    }

    if (!["development", "production"].includes(process.env.ENVIRONMENT)) {
        throw new Error("ENVIRONMENT must be either 'development' or 'production'");
    }

    if (process.env.HOST === undefined) {
        throw new Error("HOST environment variable is not set");
    }

    if (process.env.PORT === undefined) {
        throw new Error("PORT environment variable is not set");
    }

    if (parseInt(process.env.PORT) < 0 || parseInt(process.env.PORT) > 65535) {
        throw new Error("PORT must be between 0 and 65535");
    }

    if (process.env.API_KEY === undefined) {
        throw new Error("API_KEY environment variable is not set");
    }

    if (process.env.BCRYPT_SALT_ROUNDS === undefined) {
        throw new Error("BCRYPT_SALT_ROUNDS environment variable is not set");
    }

    if (isNaN(parseInt(process.env.BCRYPT_SALT_ROUNDS)) || parseInt(process.env.BCRYPT_SALT_ROUNDS) <= 0) {
        throw new Error("BCRYPT_SALT_ROUNDS must be a positive integer");
    }

    if (process.env.JWT_SECRET === undefined) {
        throw new Error("JWT_SECRET environment variable is not set");
    }

    if (process.env.WEBSOCKET_PORT === undefined) {
        throw new Error("WEBSOCKET_PORT environment variable is not set");
    }

    if (parseInt(process.env.WEBSOCKET_PORT) < 0 || parseInt(process.env.WEBSOCKET_PORT) > 65535) {
        throw new Error("WEBSOCKET_PORT must be between 0 and 65535");
    }

    if (process.env.MQTT_HOST === undefined) {
        throw new Error("MQTT_HOST environment variable is not set");
    }

    if (process.env.MQTT_PORT === undefined) {
        throw new Error("MQTT_PORT environment variable is not set");
    }

    if (parseInt(process.env.MQTT_PORT) < 0 || parseInt(process.env.MQTT_PORT) > 65535) {
        throw new Error("MQTT_PORT must be between 0 and 65535");
    }

    const logLevel: string[] = process.env.LOG_LEVEL.split(", ").filter((level: string) => {
        return ["all", "log", "debug", "verbose", "warn", "error"].includes(level);
    });

    return {
        logLevel: (logLevel && logLevel.length > 0 && logLevel[0] !== "all"
            ? logLevel
            : ["all", "log", "debug", "verbose", "warn", "error"]) as LogLevel[],
        environment: process.env.ENVIRONMENT,
        host: process.env.HOST,
        port: parseInt(process.env.PORT),
        apiKey: process.env.API_KEY,
        bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS),
        jwtSecret: process.env.JWT_SECRET,
        webSocketPort: parseInt(process.env.WEBSOCKET_PORT),
        mqttHost: process.env.MQTT_HOST,
        mqttPort: parseInt(process.env.MQTT_PORT),
    };
};
