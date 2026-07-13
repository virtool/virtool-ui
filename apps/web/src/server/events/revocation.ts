import { requireAuthenticatedRequest } from "../auth/middleware";
import { logger } from "../logger";

/**
 * Watch the session behind an open SSE connection and call `onRevoked` once it
 * stops verifying.
 *
 * The stream is authenticated once, at the handshake. Without this the session
 * backing a connected client can be deleted — by a deactivation, a password
 * change, or a forced reset — and the stream would still live on until the
 * client happened to reconnect.
 *
 * Returns a function that stops the watch. It is safe to call more than once.
 */
export function watchForRevocation(
	request: Request,
	intervalMs: number,
	onRevoked: () => void,
): () => void {
	let timer: ReturnType<typeof setInterval> | null = setInterval(
		check,
		intervalMs,
	);

	function stop(): void {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	function check(): void {
		void requireAuthenticatedRequest(request)
			.then((gate) => {
				if (gate instanceof Response) {
					stop();
					onRevoked();
				}
			})
			.catch((err) => {
				// A lookup that failed is not proof of a session that is gone. Leave
				// the stream up and try again on the next tick.
				logger.warn({ err }, "sse session revocation check failed");
			});
	}

	return stop;
}
