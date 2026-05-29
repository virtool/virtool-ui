import * as Sentry from "@sentry/tanstackstart-react";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { getCommonOptions } from "@virtool/sentry/browser";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: (failureCount: number, error: any) => {
					const status = error.response?.status;
					if ([401, 403, 404].includes(status)) {
						return false;
					}
					return failureCount <= 3;
				},
				staleTime: 2000,
			},
		},
	});

	// @ts-expect-error TanStack Router requires strictNullChecks which is not enabled in this project
	const router = createRouter({
		routeTree,
		context: { queryClient },
		defaultPendingMinMs: 0,
		scrollRestoration: true,
	});

	if (!router.isServer) {
		const options = getCommonOptions(import.meta.env);
		if (options.dsn) {
			Sentry.init({
				...options,
				integrations: [
					Sentry.tanstackRouterBrowserTracingIntegration(router),
					Sentry.replayIntegration(),
				],
			});
		}
	}

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
