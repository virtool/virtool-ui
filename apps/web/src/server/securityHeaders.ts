import type { NextFunction, Request, Response } from "express";

/**
 * Applies security headers to every request
 *
 * @func
 */
export function ApplySecurityHeadersMiddleware(
	_req: Request,
	res: Response,
	next: NextFunction,
) {
	res.set("X-Content-Type-Options", "nosniff");
	next();
}
