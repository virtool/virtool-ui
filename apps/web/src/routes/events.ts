import { requireAuthenticatedRequest } from "@server/auth/middleware";
import { eventToWsMessage } from "@server/events/broadcast";
import { listenForClientEvents } from "@server/events/listen";
import { logger } from "@server/logger";
import { createFileRoute } from "@tanstack/react-router";

const KEEPALIVE_MS = 25_000;

async function handleEvents({
	request,
}: {
	request: Request;
}): Promise<Response> {
	const gate = await requireAuthenticatedRequest(request);
	if (gate instanceof Response) {
		return gate;
	}

	const encoder = new TextEncoder();
	const stream = listenForClientEvents();

	let keepaliveTimer: ReturnType<typeof setInterval> | null = null;
	let aborted = false;

	const body = new ReadableStream<Uint8Array>({
		async start(controller) {
			function send(chunk: string) {
				try {
					controller.enqueue(encoder.encode(chunk));
				} catch {
					// controller already closed
				}
			}

			send(`: connected\n\n`);

			keepaliveTimer = setInterval(() => {
				send(`: keepalive\n\n`);
			}, KEEPALIVE_MS);

			const onAbort = async () => {
				if (aborted) {
					return;
				}
				aborted = true;
				if (keepaliveTimer) {
					clearInterval(keepaliveTimer);
					keepaliveTimer = null;
				}
				await stream.close();
				try {
					controller.close();
				} catch {
					// already closed
				}
			};

			request.signal.addEventListener("abort", () => {
				void onAbort();
			});

			try {
				for await (const event of stream.events) {
					if (aborted) {
						break;
					}

					try {
						const message = await eventToWsMessage(event);
						if (message) {
							send(`data: ${JSON.stringify(message)}\n\n`);
						}
					} catch (err) {
						logger.warn({ err, event }, "failed to deliver sse message");
					}
				}
			} catch (err) {
				logger.warn({ err }, "sse client event stream errored");
			} finally {
				await onAbort();
			}
		},
		async cancel() {
			aborted = true;
			if (keepaliveTimer) {
				clearInterval(keepaliveTimer);
				keepaliveTimer = null;
			}
			await stream.close();
		},
	});

	return new Response(body, {
		headers: {
			"Cache-Control": "no-cache, no-transform",
			Connection: "keep-alive",
			"Content-Type": "text/event-stream",
			"X-Accel-Buffering": "no",
		},
	});
}

export const Route = createFileRoute("/events")({
	server: {
		handlers: {
			GET: handleEvents,
		},
	},
});
