import { Configuration, LogLevel } from "@azure/msal-browser";

/**
 * Returns the configuration object required by MSAL (Microsoft Authentication Library)
 * to authenticate users against Azure AD B2C.
 *
 * @returns A Configuration object containing the MSAL configuration.
 */
export function getMsalConfig(): Configuration {
    return {
        auth: {
            clientId: window.virtool.b2c.clientId,
            authority: `https://${window.virtool.b2c.tenant}.b2clogin.com/TO9001.onmicrosoft.com/b2c_1_${window.virtool.b2c.userflow}`,
            knownAuthorities: [`${window.virtool.b2c.tenant}.b2clogin.com`],
            redirectUri: "/",
            postLogoutRedirectUri: "/",
        },
        cache: {
            cacheLocation: "localStorage",
            storeAuthStateInCookie: true,
        },
        system: {
            loggerOptions: {
                loggerCallback: (
                    level: LogLevel,
                    message: string,
                    containsPii: boolean,
                ): void => {
                    if (containsPii) {
                        return;
                    }
                    switch (level) {
                        case LogLevel.Error:
                            console.error(message);
                            return;
                        case LogLevel.Info:
                            console.info(message);
                            return;
                        case LogLevel.Verbose:
                            console.debug(message);
                            return;
                        case LogLevel.Warning:
                            console.warn(message);
                            return;
                        default:
                            return;
                    }
                },
            },
        },
    };
}

type ProtectedResources = {
    backendApi: {
        scopes: string[];
    };
};

/**
 * Retrieves the API scope required to access backend services securely.
 *
 * @returns An object containing the protected resources and their scopes.
 */
export function getProtectedResources(): ProtectedResources {
    return {
        backendApi: {
            scopes: [
                `https://${window.virtool.b2c.tenant}.onmicrosoft.com/${window.virtool.b2c.APIClientId}/${window.virtool.b2c.scope}`,
            ],
        },
    };
}

type LoginRequest = {
    scopes: string[];
};

/**
 * Creates a login request object with the necessary scopes for authentication.
 *
 * @returns An object containing the scopes for the login request.
 */
export function getLoginRequest(): LoginRequest {
    const protectedResources = getProtectedResources();
    return {
        scopes: [...protectedResources.backendApi.scopes],
    };
}
