import { Middleware } from "@/server/types";
import * as crypto from "node:crypto";

const defaultSrc = "default-src 'self'";
const fontAwesomeUrl = "https://use.fontawesome.com";
const fontSrc = `font-src 'self' ${fontAwesomeUrl}`;
const imgSrc = "img-src 'self' data:";

function generateCspScriptSrc(nonce) {
    return `script-src 'self' 'nonce-${nonce}' ${fontAwesomeUrl}`;
}

function generateCspStyleSrc(nonce) {
    return `style-src 'self' 'nonce-${nonce}' ${fontAwesomeUrl}`;
}

function generateCspConnectSrc() {
    return `connect-src 'self' *.sentry.io`;
}

/**
 * Applies CSP header to response object
 *
 * @func
 */
export function createCspMiddleware(): Middleware {
    return (req, res, next) => {
        const nonce = crypto.randomBytes(32).toString("base64");
        res.locals.nonce = nonce;

        const csp = [
            defaultSrc,
            fontSrc,
            imgSrc,
            generateCspConnectSrc(),
            generateCspScriptSrc(nonce),
            generateCspStyleSrc(nonce),
        ];

        res.append("Content-Security-Policy", csp.join("; "));

        next();
    };
}
