import { NextFunction, Request, Response } from "express";

/**
 * Arguments for the createCspMiddleware function.
 *
 * @typedef {Object} MiddlewareArgs
 * @property {Request} req - An express request object.
 * @property {Response} res - An express response object to which the CSP header will be applied.
 * @property {NextFunction} next - A function that passes control to the next middleware.
 */
export type Middleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => void;
