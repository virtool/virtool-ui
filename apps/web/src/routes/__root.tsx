import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NotFound from "@base/NotFound";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

interface RouterContext {
	queryClient: QueryClient;
}

function RootComponent() {
	return <Outlet />;
}

function NotFoundComponent() {
	return <NotFound />;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
	pendingComponent: LoadingPlaceholder,
	notFoundComponent: NotFoundComponent,
});
