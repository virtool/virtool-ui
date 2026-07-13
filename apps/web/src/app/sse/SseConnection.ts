import { useServerVersionStore } from "@app/serverVersion";
import { endSession } from "@app/session";
import type { QueryClient } from "@tanstack/react-query";
import { reactQueryHandler } from "./reactQueryHandler";
import { SseMessageSchema } from "./schema";

type ConnectionStatus =
	| "initializing"
	| "connecting"
	| "connected"
	| "abandoned"
	| "reconnecting";

let connection: EventSource | null = null;
let connectionStatus: ConnectionStatus = "initializing";
let interval = 500;
let handleMessage: ((data: unknown) => void) | null = null;

export function init(queryClient: QueryClient): void {
	if (handleMessage) {
		return;
	}

	const handler = reactQueryHandler(queryClient);
	handleMessage = (data) => {
		const parsed = SseMessageSchema.safeParse(data);
		if (parsed.success) {
			handler(parsed.data);
		} else {
			window.console.warn("Invalid SSE message", parsed.error);
		}
	};
}

const MAX_INTERVAL = 15000;

function scheduleReconnect(): void {
	if (interval < MAX_INTERVAL) {
		interval += 500;
	}

	setTimeout(() => {
		establishConnection();
	}, interval);
}

/**
 * Decide what to do about a connection the browser refused to retry.
 *
 * A closed `EventSource` means the server answered with something that was not
 * a 200 event-stream, but the `error` event carries no status — a revoked
 * session and a proxy 502 mid-deploy look identical. Ask which it was rather
 * than guess: signing the user out on a deploy would be worse than a slow
 * reconnect.
 */
async function handleRejectedConnection(): Promise<void> {
	let status: number;

	try {
		const response = await window.fetch("/events", { method: "HEAD" });
		status = response.status;
	} catch {
		// The probe never landed, so it says nothing about the session.
		scheduleReconnect();
		return;
	}

	// A connection was re-established while the probe was in flight.
	if (connectionStatus !== "reconnecting") {
		return;
	}

	if (status === 401) {
		connectionStatus = "abandoned";
		endSession();
		return;
	}

	scheduleReconnect();
}

export function establishConnection(): void {
	if (!handleMessage) {
		throw new Error("SSE not initialized. Call init(queryClient) first.");
	}

	// Abandoning is terminal. The session is over and the user is on their way
	// to the login wall; reconnecting would only 401 again.
	if (connectionStatus === "abandoned") {
		return;
	}

	if (connectionStatus === "connecting" || connectionStatus === "connected") {
		return;
	}

	connection?.close();

	connection = new window.EventSource("/events");
	connectionStatus = "connecting";

	connection.onopen = () => {
		interval = 500;
		connectionStatus = "connected";
	};

	connection.addEventListener("version", (event) => {
		try {
			const version = JSON.parse((event as MessageEvent).data);
			if (typeof version === "string") {
				useServerVersionStore.getState().setVersion(version);
			}
		} catch (error) {
			window.console.error("Failed to parse SSE version", error);
		}
	});

	connection.onmessage = (e) => {
		try {
			handleMessage?.(JSON.parse(e.data));
		} catch (error) {
			window.console.error("Failed to parse SSE message", error);
		}
	};

	connection.onerror = () => {
		// Read `readyState` before closing — `close()` forces it to CLOSED and
		// destroys the only signal the platform gives us. CLOSED here means the
		// browser gave up on a response it considered fatal and will not retry on
		// its own. Anything else is a dropped transport, which it would retry.
		const rejected = connection?.readyState === window.EventSource.CLOSED;

		connection?.close();
		connection = null;
		connectionStatus = "reconnecting";

		if (rejected) {
			void handleRejectedConnection();
			return;
		}

		scheduleReconnect();
	};
}

export function getConnectionStatus(): ConnectionStatus {
	return connectionStatus;
}
