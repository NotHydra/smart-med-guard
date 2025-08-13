import { Logger as NestLogger } from "@nestjs/common";
import chalk, { ChalkInstance } from "chalk";

export class LoggerService {
    private readonly logger: NestLogger = new NestLogger();
    private readonly context?: string;

    constructor(context?: string) {
        this.context = context;
    }

    private generateMessage({
        message,
        addedContext,
        color,
    }: {
        message: string;
        addedContext?: string;
        color?: ChalkInstance;
    }): string {
        return `${chalk.yellow(`[${this.context ? (addedContext ? `${this.context} -> ${addedContext}` : this.context) : addedContext}]`)} ${color ? color(message) : message}`;
    }

    public log({ message, addedContext }: { message: string; addedContext?: string }): void {
        this.logger.log(
            this.generateMessage({
                message: message,
                addedContext: addedContext,
                color: chalk.green,
            })
        );
    }

    public debug({ message, addedContext }: { message: string; addedContext?: string }): void {
        this.logger.debug(
            this.generateMessage({
                message: message,
                addedContext: addedContext,
                color: chalk.hex("#800080"),
            })
        );
    }

    public verbose({ message, addedContext }: { message: string; addedContext?: string }): void {
        this.logger.verbose(
            this.generateMessage({
                message: message,
                addedContext: addedContext,
                color: chalk.cyan,
            })
        );
    }

    public warn({ message, addedContext }: { message: string; addedContext?: string }): void {
        this.logger.warn(
            this.generateMessage({
                message: message,
                addedContext: addedContext,
                color: chalk.yellow,
            })
        );
    }

    public error({ message, addedContext }: { message: string; addedContext?: string }): void {
        this.logger.error(
            this.generateMessage({
                message: message,
                addedContext: addedContext,
                color: chalk.red,
            })
        );
    }

    public fatal({
        message,
        stackTrace,
        addedContext,
    }: {
        message: string;
        stackTrace: string;
        addedContext?: string;
    }): void {
        this.logger.fatal(
            this.generateMessage({
                message: `${message}\n${stackTrace}`,
                addedContext: addedContext,
            })
        );
    }
}
