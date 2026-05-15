import "@app/style.css";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NotFound from "@base/NotFound";
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
	component: RootComponent,
	pendingComponent: LoadingPlaceholder,
	notFoundComponent: NotFoundComponent,
});

function NotFoundComponent() {
	return <NotFound />;
}

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: { children: ReactNode }) {
	const { queryClient } = useRouteContext({ from: Route.id });

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
				<Scripts />
			</body>
		</html>
	);
}
