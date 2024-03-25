exports.formatTemplateOptions = options => {
    const useB2c =
        options.b2cUserflow || options.b2cTenant || options.b2cClientId || options.b2cScope || options.b2cApiClientId;

    if (
        useB2c &&
        !(options.b2cUserflow && options.b2cTenant && options.b2cClientId && options.b2cScope && options.b2cApiClientId)
    ) {
        console.error(
            "Aborting server start: b2c-userflow, b2c-tenant, b2c-clientId and b2c-scope must all be set to enable authentication with b2c",
        );
        process.exit(0);
    }

    return options;
};
