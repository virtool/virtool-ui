import type { ClientEvent } from "./channel";

/** Message shape sent to browser clients. */
export type WsMessage = {
	interface: string;
	operation: "insert" | "update" | "delete";
	data: { id: number | string };
};

/**
 * Convert a Postgres-published client event into the id-only message shape
 * browser clients consume. The client refetches via the normal REST API on
 * invalidation, so the server does no resource resolution here.
 */
export function eventToWsMessage(event: ClientEvent): WsMessage {
	const operation =
		event.operation === "create"
			? "insert"
			: event.operation === "update"
				? "update"
				: "delete";

	return {
		interface: event.domain,
		operation,
		data: { id: event.resource_id },
	};
}
