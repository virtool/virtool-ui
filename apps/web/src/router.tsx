import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
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
	return createRouter({
		routeTree,
		context: { queryClient },
		defaultPendingMinMs: 0,
		scrollRestoration: true,
	});
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
