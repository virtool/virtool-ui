import {
	CurrentOtuContextProvider,
	useCurrentOtuContext,
} from "@otus/components/CurrentOtuContext";
import { getRouteApi, Outlet } from "@tanstack/react-router";
import OtuIssues from "../OtuIssues";

const routeApi = getRouteApi("/_authenticated/refs/$refId/otus/$otuId");

/**
 * Provides the current OTU context to the isolate list and detail routes
 */
export default function OtuSection() {
	const { otuId, refId } = routeApi.useParams();

	return (
		<CurrentOtuContextProvider otuId={otuId} refId={refId}>
			<OtuSectionIssues />
			<Outlet />
		</CurrentOtuContextProvider>
	);
}

/**
 * Shows any OTU issues above both the isolate list and detail routes
 */
function OtuSectionIssues() {
	const { otu } = useCurrentOtuContext();

	if (!otu.issues) {
		return null;
	}

	return <OtuIssues issues={otu.issues} isolates={otu.isolates} />;
}
