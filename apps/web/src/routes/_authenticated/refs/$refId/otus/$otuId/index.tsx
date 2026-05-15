import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/refs/$refId/otus/$otuId/",
)({
	beforeLoad: () => {
		throw Route.redirect({
			to: "/refs/$refId/otus/$otuId/otu",
		});
	},
});
