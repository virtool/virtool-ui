import { useCurrentOtuContext } from "@otus/queries";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/refs/$refId/otus/$otuId/otu/",
)({
	component: IsolateIndex,
});

function IsolateIndex() {
	const { refId, otuId } = Route.useParams();
	const { otu } = useCurrentOtuContext();
	const firstIsolate = otu.isolates[0];

	if (!firstIsolate) {
		return null;
	}

	return (
		<Navigate
			to="/refs/$refId/otus/$otuId/otu/$isolateId"
			params={{ refId, otuId, isolateId: firstIsolate.id }}
			replace
		/>
	);
}
