import { program } from "commander";

export type ServerOptions = {
    apiUrl: string;
    host: string;
    port: number;
    sentryDsn: string;
    useProxy: boolean;
};

/**
 * Parses command line options
 *
 * @func
 * @param {string[]} argv - command line arguments
 * @returns {object} options - parsed options and relevant defaults
 */
export function parseOptions(argv): ServerOptions {
    program
        .option(
            "-p, --port <port>",
            "Port to listen on",
            process.env.VT_UI_PORT || "9900",
        )
        .option(
            "-H, --host <host>",
            "Host to listen on",
            process.env.VT_UI_HOST || "localhost",
        )
        .option(
            "-a, --api-url <url>",
            "URL to make API requests against",
            process.env.VT_UI_API_URL || "http://localhost:9950",
        )
        .option(
            "-P, --use-proxy [bool]",
            "Use proxy to make API requests",
            process.env.VT_UI_USE_PROXY || false,
        )
        .option(
            "--sentry-dsn <DSN>",
            "DSN for sentry logging",
            process.env.VT_UI_SENTRY_DSN || "",
        );

    return program.parse(argv).opts();
}
