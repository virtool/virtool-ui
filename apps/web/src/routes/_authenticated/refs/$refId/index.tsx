import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/refs/$refId/")({
	beforeLoad: () => {
		throw Route.redirect({ to: "/refs/$refId/manage" });
	},
});
