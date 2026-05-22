import { getLabel, LabelNotFoundError } from "../labels/data";
import { logger } from "../logger";
import type { ClientEvent } from "./channel";

/** Message shape sent to browser clients (matches the legacy WebSocket wire format). */
export type WsMessage = {
	interface: string;
	operation: "insert" | "update" | "delete";
	data: unknown;
};

type Resolver = (resourceId: number | string) => Promise<unknown>;

const resolvers: Record<string, Resolver> = {
	labels: async (id) => getLabel(Number(id)),
};

/**
 * Convert a Postgres-published client event into the message shape browser
 * clients consume. Returns `null` when the domain isn't owned by this service
 * yet (e.g. Python still emits for `samples`); the legacy WS path will deliver
 * those.
 */
export async function eventToWsMessage(
	event: ClientEvent,
): Promise<WsMessage | null> {
	if (event.operation === "delete") {
		return {
			interface: event.domain,
			operation: "delete",
			data: { id: event.resource_id },
		};
	}

	const resolve = resolvers[event.domain];
	if (!resolve) {
		return null;
	}

	try {
		const data = await resolve(event.resource_id);
		return {
			interface: event.domain,
			operation: event.operation === "create" ? "insert" : "update",
			data,
		};
	} catch (err) {
		if (err instanceof LabelNotFoundError) {
			return null;
		}
		logger.warn(
			{ err, domain: event.domain, resource_id: event.resource_id },
			"failed to resolve resource for client event",
		);
		return null;
	}
}
