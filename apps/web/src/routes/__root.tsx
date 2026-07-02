import "@app/style.css";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NotFound from "@base/NotFound";
import RouteError from "@base/RouteError";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
	useRouteContext,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

type RouterContext = {
	queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ httpEquiv: "X-UA-Compatible", content: "IE=edge" },
			{ title: "Virtool" },
		],
		links: [
			{
				rel: "shortcut icon",
				href: "/images/favicon.ico",
				type: "image/x-icon",
			},
		],
	}),
	shellComponent: RootShell,
	component: RootComponent,
	pendingComponent: LoadingPlaceholder,
	errorComponent: RouteError,
	notFoundComponent: NotFoundComponent,
});

function NotFoundComponent() {
	return <NotFound />;
}

function RootShell({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}

function RootComponent() {
	const { queryClient } = useRouteContext({ from: Route.id });

	return (
		<QueryClientProvider client={queryClient}>
			<Outlet />
		</QueryClientProvider>
	);
}
