/**
 * Name of the error a server-function handler throws for a deliberate 4xx.
 * Shared so the server that throws it, the client serialization adapter that
 * carries it — and its HTTP status — across the boundary, and the Sentry filter
 * that drops it all agree on one string.
 */
export const CLIENT_ERROR_NAME = "ClientError";
