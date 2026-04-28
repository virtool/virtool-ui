import { fetchAccount } from "@account/api";
import { accountKeys, useFetchAccount } from "@account/queries";
import { apiClient } from "@app/api";
import type { Root } from "@app/types";
import {
	establishConnection,
	getConnectionStatus,
	init,
} from "@app/websocket/WsConnection";
import Container from "@base/Container";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import MessageBanner from "@message/components/MessageBanner";
import Nav from "@nav/components/Nav";
import Sidebar from "@nav/components/Sidebar";
import type { QueryClient } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { rootKeys } from "@wall/queries";
import { lazy, Suspense, useEffect } from "react";
import { z } from "zod/v4";

const DevDialog = lazy(() => import("@dev/components/DeveloperDialog"));
const UploadOverlay = lazy(() => import("@uploads/components/UploadOverlay"));

const authenticatedSearchSchema = z.object({
	openDev: z.boolean().optional().catch(undefined),
});

function setupWebSocket(queryClient: QueryClient) {
	init(queryClient);
	const status = getConnectionStatus();
	if (status === "initializing" || status === "abandoned") {
		establishConnection();
	}
}

export const Route = createFileRoute("/_authenticated")({
	validateSearch: authenticatedSearchSchema,
	beforeLoad: async ({ context }) => {
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
		} catch {
			throw redirect({ to: "/login" });
		}
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const queryClient = useQueryClient();
	const { data, isPending } = useFetchAccount();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	useEffect(() => {
		if (data) {
			setupWebSocket(queryClient);
		}
	}, [data, queryClient]);

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	return (
		<>
			<title>Virtool</title>
			<meta charSet="utf-8" />

			<div className="bg-transparent fixed top-0 w-full z-50">
				<MessageBanner />
				<Nav
					administrator_role={data.administrator_role}
					handle={data.handle}
					setOpenDev={(openDev) => navigate({ search: { ...search, openDev } })}
				/>
			</div>

			<div className="pt-24">
				<Suspense
					fallback={
						<Container>
							<LoadingPlaceholder />
						</Container>
					}
				>
					<Outlet />
				</Suspense>
			</div>

			<Sidebar administratorRole={data.administrator_role} />

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
