import * as Sentry from "@sentry/tanstackstart-react";
import { getCommonOptions } from "@virtool/sentry";

// Server-side Sentry initialisation. Imported for its side effect at the top of
// `server.ts` so the SDK is ready before any request is handled. `enableLogs`
// (set in `getCommonOptions`) is what lets `@virtool/logger` forward records via
// `Sentry.logger`. No DSN means no init, so dev and unconfigured deploys are
// untouched.
const options = getCommonOptions();

if (options.dsn) {
	// Load the profiler lazily and only when configured. `@sentry/profiling-node`
	// pulls in a native CommonJS addon that the Vite/Nitro SSR transform can't
	// process, so a top-level import would break dev and tests where no DSN is
	// set. Mirrors the DSN-gated `await import` used for the pino→Sentry stream.
	const { nodeProfilingIntegration } = await import("@sentry/profiling-node");
	Sentry.init({
		...options,
		integrations: [nodeProfilingIntegration()],
	});
}
