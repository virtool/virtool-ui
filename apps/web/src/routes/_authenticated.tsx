import { accountQueryOptions, useFetchAccount } from "@account/queries";
import { apiClient } from "@app/api";
import { CONTENT_SCROLL_ID } from "@app/scroll";
import * as Sse from "@app/sse/SseConnection";
import type { Root } from "@app/types";
import Banner from "@banner/components/Banner";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Nav from "@nav/components/Nav";
import Sidebar from "@nav/components/Sidebar";
import UpdateToast from "@nav/components/UpdateToast";
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
			await queryClient.ensureQueryData(accountQueryOptions());
		} catch {
			throw redirect({
				to: "/login",
				search: { redirect: location.href },
			});
		}
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const queryClient = useQueryClient();
	const { data, isPending } = useFetchAccount();
	const location = useLocation();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	useEffect(() => {
		if (data) {
			setupSse(queryClient);
		}
	}, [data, queryClient]);

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	if (!data) {
		return (
			<Navigate to="/login" replace search={{ redirect: location.href }} />
		);
	}

	return (
		<>
			<title>Virtool</title>
			<meta charSet="utf-8" />

			<UpdateToast />

			<div className="flex flex-col h-screen">
				<div className="shrink-0 z-50">
					<Banner />
					<Nav
						administrator_role={data.administrator_role}
						handle={data.handle}
						setOpenDev={(openDev) =>
							navigate({ search: { ...search, openDev } })
						}
					/>
				</div>

				<div
					id={CONTENT_SCROLL_ID}
					className="flex flex-1 min-h-0 overflow-y-auto scrollbar-gutter-stable"
				>
					<aside className="sticky top-0 self-start pt-18">
						<Sidebar administratorRole={data.administrator_role} />
					</aside>
					<main className="flex-1 min-w-0 p-18">
						<Suspense fallback={<LoadingPlaceholder />}>
							<Outlet />
						</Suspense>
					</main>
				</div>
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
