import { CurrentOtuContextProvider } from "@otus/queries";
import { getRouteApi, Outlet } from "@tanstack/react-router";

const routeApi = getRouteApi("/_authenticated/refs/$refId/otus/$otuId");

/**
 * Provides the current OTU context to the isolate list and detail routes
 */
export default function OtuSection() {
	const { otuId, refId } = routeApi.useParams();

	return (
		<CurrentOtuContextProvider otuId={otuId} refId={refId}>
			<Outlet />
		</CurrentOtuContextProvider>
	);
}
