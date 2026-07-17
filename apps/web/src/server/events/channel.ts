import type { SseDomain } from "@virtool/contracts";

/** Postgres channel shared with the upstream Python service for resource-change events. */
export const CLIENT_EVENTS_CHANNEL = "client_events";

/** Resource-change operation as published on the `client_events` channel. */
export type EventOperation = "create" | "update" | "delete";

/** Primary-key type for each domain that may appear on the channel. */
export type ResourceId<D extends SseDomain> = D extends
	| "indexes"
	| "references"
	| "roles"
	? string
	: number;

/** Payload shape published on the `client_events` channel by both Python and Node emitters. */
export type ClientEvent = {
	domain: SseDomain;
	resource_id: number | string;
	operation: EventOperation;
};
