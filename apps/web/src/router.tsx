import RouteError from "@base/RouteError";
import * as Sentry from "@sentry/tanstackstart-react";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { getCommonOptions } from "@virtool/sentry/browser";
import { CONTENT_SCROLL_ID } from "./app/scroll";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const queryClient = new QueryClient({
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
					// TanStack Start server-function errors cross the boundary as plain
					// `Error`s with only `name`/`message` preserved — the status set via
					// `setResponseStatus` is not attached. Match the auth errors by name
					// so a 401/403 (e.g. after logout) rejects immediately instead of
					// retrying ~4× while the screen sits blank before the route can
					// bounce to /login.
					if (
						error.name === "UnauthorizedError" ||
						error.name === "ForbiddenError"
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
		defaultPendingMinMs: 0,
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
		// Name the keys rather than passing the env object whole. Vite serializes
		// every `VT_`-prefixed variable present at build time into the bundle for
		// a whole-object reference, which would ship server-only secrets like
		// VT_STORAGE_S3_SECRET_ACCESS_KEY to the browser. A member access inlines
		// only the key it names. Guarded by src/app/__tests__/clientEnv.test.ts.
		const options = getCommonOptions({
			MODE: import.meta.env.MODE,
			VT_SENTRY_DSN: import.meta.env.VT_SENTRY_DSN,
		});
		if (options.dsn) {
			Sentry.init({
				...options,
				integrations: [
					Sentry.tanstackRouterBrowserTracingIntegration(router),
					Sentry.browserProfilingIntegration(),
					Sentry.replayIntegration(),
				],
			});
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
