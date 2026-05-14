import { useQueryClient } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";

// @ts-expect-error TanStack Router requires strictNullChecks which is not enabled in this project
export const router = createRouter({
	routeTree,
	defaultPendingMinMs: 0,
	context: {
		queryClient: undefined!,
	},
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export default function AppRouter() {
	const queryClient = useQueryClient();

	return <RouterProvider router={router} context={{ queryClient }} />;
}
