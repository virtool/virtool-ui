import { readSentryDsn } from "@app/sentryDsn";
import RouteError from "@base/RouteError";
import * as Sentry from "@sentry/tanstackstart-react";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import {
	FORBIDDEN_ERROR_NAME,
	UNAUTHORIZED_ERROR_NAME,
} from "@virtool/contracts";
import { getCommonOptions } from "@virtool/sentry/browser";
import { CONTENT_SCROLL_ID } from "./app/scroll";
import { scheduleReplay } from "./app/sentryReplay";
import { endSession } from "./app/session";
import { routeTree } from "./routeTree.gen";

// Server-function errors reach the client with their `name` preserved only
// because `authErrorSerializationAdapter` (start.ts) carries it past Router's
// ShallowErrorPlugin, so a 401 is matched by name here. Superagent calls are
// covered by the interceptor in `app/api.ts` instead.
function handleAuthenticationError(error: Error): void {
	if (error.name === UNAUTHORIZED_ERROR_NAME) {
		endSession();
	}
}

export function getRouter() {
	const queryClient = new QueryClient({
		queryCache: new QueryCache({ onError: handleAuthenticationError }),
		mutationCache: new MutationCache({ onError: handleAuthenticationError }),
		defaultOptions: {
			queries: {
				retry: (
					failureCount: number,
					error: Error & { response?: { status?: number } },
				) => {
					// Superagent (legacy Python API) errors carry the HTTP status here.
					const status = error.response?.status;
					if (status !== undefined && [401, 403, 404].includes(status)) {
						return false;
					}
					// TanStack Start server-function errors cross the boundary with only
					// `message` preserved by default; the status set via
					// `setResponseStatus` is not attached, and Router's ShallowErrorPlugin
					// drops `name`. `authErrorSerializationAdapter` (registered in
					// start.ts) keeps the auth errors' `name`, so matching by name here
					// makes a 401/403 (e.g. after logout, or an unauthenticated first
					// visit) reject immediately instead of retrying ~4× while the screen
					// sits blank before the route can bounce to /login.
					if (
						error.name === UNAUTHORIZED_ERROR_NAME ||
						error.name === FORBIDDEN_ERROR_NAME
					) {
						return false;
					}
					return failureCount <= 3;
				},
				staleTime: 2000,
			},
		},
	});

	const router = createRouter({
		routeTree,
		context: { queryClient },
		// Every route inherits this error boundary unless it sets its own
		// `errorComponent`. It catches both rejected loaders and errors thrown
		// from `useSuspenseQuery` during render, so a failed query surfaces a
		// real error state instead of an indefinite loading placeholder.
		defaultErrorComponent: RouteError,
		// `defaultPendingMinMs` is deliberately left at the router's default. Do
		// not set it to 0: on a hard load, `hydrate()` only arms `_forcePending`
		// when it is truthy, and that flag is what makes `loadMatches` commit the
		// pending matches up front instead of after every loader has settled. With
		// it at 0, a rendered match sits at `status: "pending"` while the loader
		// that owns its (shared) `loadPromise` finishes and clears it — so
		// `MatchInner` throws `undefined`, `CatchBoundary` tests the thrown value
		// for truthiness and lets it through, and the whole app unmounts to a blank
		// page. The window stays open for as long as the slowest loader in the
		// chain runs, which is why only routes with a slow loader (a pathoscope
		// analysis document) hit it. See TanStack/router#7753.
		// Preload routes on hover/touch/focus. Loaders back onto React Query via
		// `ensureQueryData`, so a 0 preload stale time hands freshness decisions
		// entirely to React Query's own `staleTime`/`gcTime` instead of letting
		// the router's 30s default short-circuit preloads.
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		// The document no longer scrolls — the authenticated shell scrolls an
		// inner container so the navbar can stay full-bleed with a stable
		// scrollbar gutter. Point scroll-to-top on navigation at that container;
		// back/forward restoration of it is handled automatically by the watcher.
		scrollRestoration: true,
		scrollToTopSelectors: [`#${CONTENT_SCROLL_ID}`],
	});

	// `import.meta.env.SSR` is a compile-time constant, so the whole block is
	// dead-code-eliminated from the server bundle. `browserProfilingIntegration`
	// has no server stub (unlike the replay/tracing integrations), so leaving the
	// reference in the SSR build would warn about an undefined import.
	if (!import.meta.env.SSR) {
		// The DSN comes from a `<meta>` tag the server renders from its runtime
		// env (see `@app/sentryDsn` and the root route's `head`), not from a
		// build-time `import.meta.env.VT_SENTRY_DSN` inline that would freeze in
		// whatever DSN (usually none) was present when the image was built.
		// `MODE` is read from `import.meta.env.MODE`: it is the build mode and
		// only drives sample rates.
		const options = getCommonOptions({
			MODE: import.meta.env.MODE,
			VT_SENTRY_DSN: readSentryDsn(),
		});
		if (options.dsn) {
			Sentry.init({
				...options,
				integrations: [
					Sentry.tanstackRouterBrowserTracingIntegration(router),
					Sentry.browserProfilingIntegration(),
				],
			});
			// Replay is registered after first paint rather than here — see
			// `scheduleReplay`. Its sample rates still come from `options`.
			scheduleReplay();
		}
	}

	return router;
}

declare module "@tanstack/react-router" {
	// biome-ignore lint/style/useConsistentTypeDefinitions: module augmentation merges into TanStack Router's Register interface
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
