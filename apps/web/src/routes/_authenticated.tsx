import { fetchAccount } from "@account/api";
import { accountKeys, useFetchAccount } from "@account/queries";
import { apiClient } from "@app/api";
import * as Sse from "@app/sse/SseConnection";
import type { Root } from "@app/types";
import Banner from "@banner/components/Banner";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Nav from "@nav/components/Nav";
import Sidebar from "@nav/components/Sidebar";
import type { QueryClient } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
	createFileRoute,
	Navigate,
	Outlet,
	redirect,
	useLocation,
} from "@tanstack/react-router";
import { rootKeys } from "@wall/queries";
import { lazy, Suspense, useEffect } from "react";
import { z } from "zod/v4";

const DevDialog = lazy(() => import("@dev/components/DeveloperDialog"));
const UploadOverlay = lazy(() => import("@uploads/components/UploadOverlay"));

const authenticatedSearchSchema = z.object({
	openDev: z.boolean().optional().catch(undefined),
});

function setupSse(queryClient: QueryClient) {
	Sse.init(queryClient);
	const status = Sse.getConnectionStatus();
	if (status === "initializing" || status === "abandoned") {
		Sse.establishConnection();
	}
}

/**
 * True when an error is the auth middleware's `UnauthorizedError` — a 401 from a
 * server function. Matched by name because the class lives server-side
 * (`server/auth/middleware.ts`) and crosses the server-function boundary as a
 * plain `Error` with its `name` preserved. Any other failure (network blip, 5xx)
 * is treated as transient and must not bounce a logged-in user to login.
 */
function isUnauthorizedError(error: unknown): boolean {
	return error instanceof Error && error.name === "UnauthorizedError";
}

export const Route = createFileRoute("/_authenticated")({
	validateSearch: authenticatedSearchSchema,
	beforeLoad: async ({ context, location }) => {
		const { queryClient } = context;

		const rootData = await queryClient.ensureQueryData<Root>({
			queryKey: rootKeys.all(),
			queryFn: () => apiClient.get("/").then((res) => res.body),
		});

		if (rootData.first_user) {
			throw redirect({ to: "/setup" });
		}

		try {
			await queryClient.ensureQueryData({
				queryKey: accountKeys.all(),
				queryFn: fetchAccount,
			});
		} catch (error) {
			// Only a genuine auth failure bounces the user to login. Transient
			// failures (network blips, 5xx) are swallowed so the route still loads
			// and the component can render any cached account data.
			if (isUnauthorizedError(error)) {
				throw redirect({
					to: "/login",
					// biome-ignore lint/suspicious/noExplicitAny: route search type is `AnyRoute` because tsconfig has `strict: false` (see AppRouter.tsx)
					search: { redirect: location.href } as any,
				});
			}
		}
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const queryClient = useQueryClient();
	const { data, isError, error } = useFetchAccount();
	const location = useLocation();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	useEffect(() => {
		if (data) {
			setupSse(queryClient);
		}
	}, [data, queryClient]);

	// A genuine auth failure always sends the user to login, even when stale
	// account data is still cached.
	if (isError && isUnauthorizedError(error)) {
		return (
			<Navigate
				to="/login"
				replace
				// biome-ignore lint/suspicious/noExplicitAny: route search type is `AnyRoute` because tsconfig has `strict: false` (see AppRouter.tsx)
				search={{ redirect: location.href } as any}
			/>
		);
	}

	// No account data yet — initial load in flight, or a transient failure left
	// nothing cached to show. A transient refetch failure once data exists falls
	// through to the render below, keeping the logged-in user in place.
	if (!data) {
		return <LoadingPlaceholder />;
	}

	return (
		<>
			<title>Virtool</title>
			<meta charSet="utf-8" />

			<div className="bg-transparent fixed top-0 w-full z-50">
				<Banner />
				<Nav
					administrator_role={data.administrator_role}
					handle={data.handle}
					setOpenDev={(openDev) => navigate({ search: { ...search, openDev } })}
				/>
			</div>

			<div className="pt-30 flex">
				<aside className="sticky top-30 self-start">
					<Sidebar administratorRole={data.administrator_role} />
				</aside>
				<main className="flex-1 min-w-0 px-9">
					<Suspense fallback={<LoadingPlaceholder />}>
						<Outlet />
					</Suspense>
				</main>
			</div>

			<Suspense fallback={null}>
				<DevDialog
					open={Boolean(search.openDev)}
					setOpen={(openDev) => navigate({ search: { ...search, openDev } })}
				/>
				<UploadOverlay />
			</Suspense>
		</>
	);
}
