import type { Account } from "@account/types";
import { faker } from "@faker-js/faker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
} from "@tanstack/react-router";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render as rtlRender } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createContext, type ReactNode, useContext, useState } from "react";
import { vi } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { createFakeAccount } from "./fake/account";

process.env.TZ = "UTC";

faker.seed(1);

export function wrapWithProviders(ui: ReactNode) {
	const queryClient = new QueryClient();

	return <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>;
}

export function renderWithProviders(ui: ReactNode) {
	const { rerender, ...rest } = rtlRender(wrapWithProviders(ui));

	return { ...rest, rerender };
}

export function renderWithRouter(ui: ReactNode, path?: string) {
	const history: string[] = [];

	const rootRoute = createRootRoute();
	const catchAllRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "$",
		component: () => ui,
	});
	rootRoute.addChildren([catchAllRoute]);

	const memoryHistory = createMemoryHistory({
		initialEntries: [path || "/"],
	});

	// @ts-expect-error createRouter requires strictNullChecks
	const router = createRouter({
		routeTree: rootRoute,
		history: memoryHistory,
		defaultPendingMinMs: 0,
	});

	router.history.subscribe(({ action }) => {
		if (action.type === "REPLACE" && history.length > 0) {
			history[history.length - 1] = router.state.location.href;
		} else {
			history.push(router.state.location.href);
		}
	});

	const result = renderWithProviders(<RouterProvider router={router} />);
	return { ...result, history };
}

const MemoryRouterChildrenContext = createContext<ReactNode>(null);

function MemoryRouterCatchAll() {
	return <>{useContext(MemoryRouterChildrenContext)}</>;
}

export function MemoryRouter({
	children,
	path,
}: {
	children: ReactNode;
	path?: string;
}) {
	const [router] = useState(() => {
		const rootRoute = createRootRoute({ component: () => <Outlet /> });
		const catchAllRoute = createRoute({
			getParentRoute: () => rootRoute,
			path: "$",
			component: MemoryRouterCatchAll,
		});
		rootRoute.addChildren([catchAllRoute]);

		// @ts-expect-error createRouter requires strictNullChecks
		return createRouter({
			routeTree: rootRoute,
			history: createMemoryHistory({ initialEntries: [path || "/"] }),
			defaultPendingMinMs: 0,
		});
	});

	return (
		<MemoryRouterChildrenContext value={children}>
			<RouterProvider router={router} />
		</MemoryRouterChildrenContext>
	);
}

interface RenderRouteOptions {
	account?: Account;
	seed?: (queryClient: QueryClient) => void;
}

export async function renderRoute(path: string, opts?: RenderRouteOptions) {
	const history: string[] = [];
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	queryClient.setQueryData(["root"], { first_user: false });
	queryClient.setQueryData(["account"], opts?.account ?? createFakeAccount());
	queryClient.setQueryData(["message"], { message: "" });

	if (opts?.seed) {
		opts.seed(queryClient);
	}

	const memoryHistory = createMemoryHistory({ initialEntries: [path] });

	// @ts-expect-error createRouter requires strictNullChecks
	const router = createRouter({
		routeTree,
		history: memoryHistory,
		defaultPendingMinMs: 0,
		context: { queryClient },
	});

	router.history.subscribe(({ action }) => {
		if (action.type === "REPLACE" && history.length > 0) {
			history[history.length - 1] = router.state.location.href;
		} else {
			history.push(router.state.location.href);
		}
	});

	await router.load();

	const result = rtlRender(
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>,
	);

	return { ...result, history, router, queryClient };
}

//mocks HTML element prototypes that are not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

function attachResizeObserver() {
	window.ResizeObserver = ResizeObserver;
}

attachResizeObserver();

// Globals are defined here to limit import redundancies.
global.fireEvent = fireEvent;
global.userEvent = userEvent;
global.renderWithProviders = renderWithProviders;
global.wrapWithProviders = wrapWithProviders;
