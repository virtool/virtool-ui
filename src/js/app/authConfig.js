import { LogLevel } from "@azure/msal-browser";

export const getMsalConfig = () => {
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
                loggerCallback: (level, message, containsPii) => {
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
};

export const getProtectedResources = () => ({
    backendApi: {
        scopes: [
            `https://${window.virtool.b2c.tenant}.onmicrosoft.com/${window.virtool.b2c.APIClientId}/${window.virtool.b2c.scope}`,
        ],
    },
});

export const getLoginRequest = () => {
    const protectedResources = getProtectedResources();
    return {
        scopes: [...protectedResources.backendApi.scopes],
    };
};
