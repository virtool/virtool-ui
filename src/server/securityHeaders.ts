import { NextFunction, Request, Response } from "express";

/**
 * Applies security headers to every request
 *
 * @func
 */
export function ApplySecurityHeadersMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    res.set("X-Content-Type-Options", "nosniff");
    next();
}
