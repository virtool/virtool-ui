import type { SseMessage } from "@app/sse/schema";
import type { ClientEvent } from "./channel";

/**
 * Convert a Postgres-published client event into the id-only message shape
 * browser clients consume. The client refetches via the normal REST API on
 * invalidation, so the server does no resource resolution here.
 */
export function eventToSseMessage(event: ClientEvent): SseMessage {
	const operation =
		event.operation === "create"
			? "insert"
			: event.operation === "update"
				? "update"
				: "delete";

	return {
		domain: event.domain,
		operation,
		id: event.resource_id,
	};
}
