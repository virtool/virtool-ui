import { createLogger, format, transports } from "winston";

export const logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.Console()],
});

export function loggingMiddleware(req: any, res: any, next: any) {
    logger.log("info", "handled request", {
        ip: req.ip,
        path: req.path,
        method: req.method,
    });
    next();
}
