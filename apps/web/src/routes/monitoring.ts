import * as Sentry from "@sentry/tanstackstart-react";
import { createFileRoute } from "@tanstack/react-router";

// Same-origin tunnel for browser-side Sentry envelopes: ad-blockers and strict
// `connect-src` policies drop events sent straight to `*.ingest.sentry.io`, so
// the browser SDK's `tunnel` option (set in `router.tsx`) POSTs them here and
// this handler forwards them on.
//
// `allowedDsns` is omitted deliberately, so the route defers to the DSN of the
// server-side SDK (`instrument.server.ts`); both it and the client's envelope
// DSN are serialised by the same `dsnToString`, so they match without threading
// the runtime DSN through here. Passing the raw env string would risk a
// canonicalisation mismatch and silently reject every envelope.
//
// The route is intentionally unauthenticated: errors on the login wall are
// exactly the ones worth keeping, and the DSN check already bars the endpoint
// from being used as an open proxy to arbitrary Sentry projects.
export const Route = createFileRoute("/monitoring")({
	server: Sentry.createSentryTunnelRoute({}),
});
