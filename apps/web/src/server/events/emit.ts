import type { SseDomain } from "@virtool/contracts";
import { client } from "../db/pg";
import { logger } from "../logger";
import {
	CLIENT_EVENTS_CHANNEL,
	type ClientEvent,
	type EventOperation,
	type ResourceId,
} from "./channel";

/**
 * Publish a resource-change event on the shared `client_events` channel via
 * Postgres NOTIFY. Mirrors the payload shape emitted by the Python service so
 * a single listener can fan out events from either source.
 */
export async function emit<D extends SseDomain>(
	domain: D,
	resourceId: ResourceId<D>,
	operation: EventOperation,
): Promise<void> {
	const payload: ClientEvent = {
		domain,
		resource_id: resourceId,
		operation,
	};

	try {
		await client.notify(CLIENT_EVENTS_CHANNEL, JSON.stringify(payload));
		logger.debug({ ...payload }, "emitted client event");
	} catch (err) {
		logger.error({ err, ...payload }, "failed to emit client event");
	}
}
