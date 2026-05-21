import type { QueryClient } from "@tanstack/react-query";
import { reactQueryHandler } from "../websocket/reactQueryHandler";
import { WsMessageSchema } from "../websocket/schema";

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
		const parsed = WsMessageSchema.safeParse(data);
		if (parsed.success) {
			handler(parsed.data);
		} else {
			window.console.warn("Invalid SSE message", parsed.error);
		}
	};
}

export function establishConnection(): void {
	if (!handleMessage) {
		throw new Error("SSE not initialized. Call init(queryClient) first.");
	}

	if (connectionStatus === "connecting" || connectionStatus === "connected") {
		return;
	}

	connection?.close();

	connection = new window.EventSource("/api/events");
	connectionStatus = "connecting";

	connection.onopen = () => {
		interval = 500;
		connectionStatus = "connected";
	};

	connection.onmessage = (e) => {
		try {
			handleMessage?.(JSON.parse(e.data));
		} catch (error) {
			window.console.error("Failed to parse SSE message", error);
		}
	};

	connection.onerror = () => {
		connection?.close();
		connection = null;
		connectionStatus = "reconnecting";

		if (interval < 15000) {
			interval += 500;
		}

		setTimeout(() => {
			establishConnection();
		}, interval);
	};
}

export function getConnectionStatus(): ConnectionStatus {
	return connectionStatus;
}
