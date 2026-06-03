import { createFileRoute } from "@tanstack/react-router";

function handleLive(): Response {
	return Response.json({ status: "alive" });
}

export const Route = createFileRoute("/health/live")({
	server: {
		handlers: {
			GET: handleLive,
		},
	},
});
