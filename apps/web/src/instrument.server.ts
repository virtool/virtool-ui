import * as Sentry from "@sentry/tanstackstart-react";
import { getCommonOptions } from "@virtool/sentry";

// Server-side Sentry initialisation. Imported for its side effect at the top of
// `server.ts` so the SDK is ready before any request is handled. `enableLogs`
// (set in `getCommonOptions`) is what lets `@virtool/logger` forward records via
// `Sentry.logger`. No DSN means no init, so dev and unconfigured deploys are
// untouched.
const options = getCommonOptions();

if (options.dsn) {
	Sentry.init(options);
}
