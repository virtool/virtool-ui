import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/samples/$sampleId/")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/samples/$sampleId/general",
			params: true,
		});
	},
});
