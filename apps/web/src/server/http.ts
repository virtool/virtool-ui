// Helpers shared by the raw routes — the handlers that build a `Response`
// themselves rather than returning a value through the server-function RPC
// layer, because the browser has to see real headers.

/**
 * A plain-text response, for the statuses a raw route answers with directly.
 *
 * A route runs outside the server-function context, so it has no `ClientError`
 * to throw and no `setResponseStatus` to call — it returns the status as a
 * response of its own.
 */
export function textResponse(message: string, status: number): Response {
	return new Response(message, { status });
}
