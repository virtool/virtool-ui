import { handleUpload } from "@server/uploads/upload";
import { createFileRoute } from "@tanstack/react-router";

// A raw route, not a server function: it streams a multi-GB request body to
// storage and is posted to with XMLHttpRequest so the client can report upload
// progress. See `@server/uploads/upload` for why.
export const Route = createFileRoute("/uploads")({
	server: {
		handlers: {
			POST: ({ request }) => handleUpload(request),
		},
	},
});
