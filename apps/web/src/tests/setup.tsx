import { accountQueryKeys } from "@account/queries";
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
import { rootQueryKeys } from "@wall/queries";
import "@testing-library/jest-dom/vitest";
import {
	fireEvent,
	renderHook,
	render as rtlRender,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createContext, type ReactNode, useContext, useState } from "react";
import { beforeEach, vi } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { authServerFnMocks } from "./api/auth";
import { groupServerFnMocks } from "./api/groups";
import { jobServerFnMocks } from "./api/jobs";
import { userServerFnMocks } from "./api/users";
import { createFakeAccount } from "./fake/account";

vi.mock("@server/groups/functions", () => groupServerFnMocks);
// See the users mock below for why this resolves the mock via dynamic import.
vi.mock("@server/auth/functions", async () => {
	const { authServerFnMocks } = await import("./api/auth");
	return authServerFnMocks;
});
// Resolve the mock lazily via dynamic import. A direct reference to the
// imported `userServerFnMocks` binding races route modules (pulled in by
// `routeTree`) that import the mocked module before this binding initializes.
vi.mock("@server/users/functions", async () => {
	const { userServerFnMocks } = await import("./api/users");
	return userServerFnMocks;
});
vi.mock("@server/jobs/functions", async () => {
	const { jobServerFnMocks } = await import("./api/jobs");
	return jobServerFnMocks;
});

beforeEach(() => {
	for (const fn of Object.values(groupServerFnMocks)) {
		fn.mockReset();
	}
	for (const fn of [
		...Object.values(userServerFnMocks),
		...Object.values(jobServerFnMocks),
		...Object.values(authServerFnMocks),
	]) {
		fn.mockReset();
		// Default to a pending promise so an un-stubbed query renders its loading
		// state instead of resolving to `undefined`.
		fn.mockReturnValue(new Promise(() => {}));
	}
});

process.env.TZ = "UTC";

faker.seed(1);

/**
 * Return the element at `index`, throwing if the array has no such element.
 *
 * Lets tests index into fixture data they built without a non-null assertion,
 * which `noUncheckedIndexedAccess` would otherwise require.
 */
export function at<T>(items: readonly T[], index: number): T {
	const item = items[index];
	if (item === undefined) {
		throw new Error(`expected an element at index ${index}`);
	}
	return item;
}

export function wrapWithProviders(ui: ReactNode) {
	const queryClient = new QueryClient();

	return <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>;
}

export function renderWithProviders(ui: ReactNode) {
	const { rerender, ...rest } = rtlRender(wrapWithProviders(ui));

	return { ...rest, rerender };
}

export async function renderWithRouter(ui: ReactNode, path?: string) {
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

	await router.load();

	const result = renderWithProviders(<RouterProvider router={router} />);
	return { ...result, history, router };
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

export async function renderHookWithRouter<T>(hook: () => T, path?: string) {
	const rootRoute = createRootRoute({ component: () => <Outlet /> });
	const catchAllRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "$",
		component: MemoryRouterCatchAll,
	});
	rootRoute.addChildren([catchAllRoute]);

	const router = createRouter({
		routeTree: rootRoute,
		history: createMemoryHistory({ initialEntries: [path || "/"] }),
		defaultPendingMinMs: 0,
	});

	await router.load();

	return renderHook(hook, {
		wrapper: ({ children }: { children: ReactNode }) => (
			<MemoryRouterChildrenContext value={children}>
				<RouterProvider router={router} />
			</MemoryRouterChildrenContext>
		),
	});
}

type RenderRouteOptions = {
	account?: Account;
	seed?: (queryClient: QueryClient) => void;
};

export async function renderRoute(path: string, opts?: RenderRouteOptions) {
	const history: string[] = [];
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	queryClient.setQueryData(rootQueryKeys.all(), { first_user: false });
	queryClient.setQueryData(
		accountQueryKeys.all(),
		opts?.account ?? createFakeAccount(),
	);

	if (opts?.seed) {
		opts.seed(queryClient);
	}

	const memoryHistory = createMemoryHistory({ initialEntries: [path] });

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

// jsdom does not implement EventSource; the SSE bridge constructs one when the
// authenticated layout mounts, so any route-level test that renders it would
// throw. A noop stand-in keeps the connection inert during tests. The
// readyState constants are part of the surface: SseConnection reads
// `window.EventSource.CLOSED` to tell a rejected handshake from a dropped
// transport.
class FakeEventSource {
	static readonly CONNECTING = 0;
	static readonly OPEN = 1;
	static readonly CLOSED = 2;

	readyState: number = FakeEventSource.CONNECTING;

	close() {
		this.readyState = FakeEventSource.CLOSED;
	}
	addEventListener() {}
	removeEventListener() {}
	dispatchEvent() {
		return true;
	}
	onopen: ((this: EventSource, ev: Event) => unknown) | null = null;
	onmessage: ((this: EventSource, ev: MessageEvent) => unknown) | null = null;
	onerror: ((this: EventSource, ev: Event) => unknown) | null = null;
}
// @ts-expect-error FakeEventSource only implements the surface SseConnection touches.
window.EventSource = FakeEventSource;

//mocks HTML element prototypes that are not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.scrollTo = vi.fn();

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
