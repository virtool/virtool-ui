/** Postgres channel shared with the upstream Python service for resource-change events. */
export const CLIENT_EVENTS_CHANNEL = "client_events";

/** Resource-change operation as published on the `client_events` channel. */
export type EventOperation = "create" | "update" | "delete";

/** Payload shape published on the `client_events` channel by both Python and Node emitters. */
export type ClientEvent = {
	domain: string;
	resource_id: number | string;
	operation: EventOperation;
};
