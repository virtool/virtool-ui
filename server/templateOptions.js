exports.formatTemplateOptions = (options) => {
  if (
    options.useB2c &&
    !(
      options.b2cUserflow &&
      options.b2cTenant &&
      options.b2cClientId &&
      options.b2cScope &&
      options.b2cApiClientId
    )
  ) {
    console.error(
      "Aborting server start: b2c-userflow, b2c-tenant, b2c-clientId and b2c-scope must all be set with when enabling authentication via b2c"
    );
    process.exit(0);
  }

  return {
    use_b2c: options.useB2c,
    b2c_userflow: options.b2cUserflow,
    b2c_tenant: options.b2cTenant,
    b2c_client_id: options.b2cClientId,
    b2c_scope: options.b2cScope,
    b2c_api_client_id: options.b2cApiClientId,
    sentry_dsn: options.sentryDsn,
  };
};
