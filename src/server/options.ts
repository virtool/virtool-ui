import { program } from "commander";

export type ServerOptions = {
    apiUrl: string;
    b2cApiClientId?: string;
    b2cClientId?: string;
    b2cScope?: string;
    b2cTenant?: string;
    b2cUserflow?: string;
    host: string;
    port: number;
    sentryDsn: string;
    useB2c: boolean;
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
        .option("-p, --port <port>", "Port to listen on", process.env.VT_UI_PORT || "9900")
        .option("-H, --host <host>", "Host to listen on", process.env.VT_UI_HOST || "localhost")
        .option(
            "-a, --api-url <url>",
            "URL to make API requests against",
            process.env.VT_UI_API_URL || "http://localhost:9950",
        )
        .option("-P, --use-proxy [bool]", "Use proxy to make API requests", process.env.VT_UI_USE_PROXY || false)
        .option("--sentry-dsn <DSN>", "DSN for sentry logging", process.env.VT_UI_SENTRY_DSN || "")
        .option("--use-b2c [bool]", "Allow usage of B2C for authentication", process.env.VT_UI_USE_B2C || false)
        .option("--b2c-userflow <b2c_userflow>", "Name of b2c login userflow", process.env.VT_UI_B2C_USERFLOW || "")
        .option("--b2c-tenant <b2c_tenant>", "Name of b2c tenant", process.env.VT_UI_B2C_TENANT || "")
        .option(
            "--b2c-client-id <b2c_client_id>",
            "The frontend b2c application clientId",
            process.env.VT_UI_B2C_CLIENT_ID || "",
        )
        .option("--b2c-scope <b2c_scope>", "The B2C backend api scope", process.env.VT_UI_B2C_SCOPE || "")
        .option(
            "--b2c-api-client-id <b2c_api_client_id>",
            "The backend api's B2C client id",
            process.env.VT_UI_B2C_API_CLIENT_ID || "",
        );

    return program.parse(argv).opts();
}
