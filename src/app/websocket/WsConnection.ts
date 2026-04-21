import type { QueryClient } from "@tanstack/react-query";
import { resetClient } from "../utils";
import { reactQueryHandler } from "./reactQueryHandler";
import type { WsMessage } from "./schema";
import { WsMessageSchema } from "./schema";

type ConnectionStatus =
	| "initializing"
	| "connecting"
	| "connected"
	| "abandoned"
	| "reconnecting";

let connection: WebSocket | null = null;
let connectionStatus: ConnectionStatus = "initializing";
let interval = 500;
let handleMessage: ((message: WsMessage) => void) | null = null;

export function init(queryClient: QueryClient): void {
	if (handleMessage) {
		return;
	}

	const handler = reactQueryHandler(queryClient);
	handleMessage = (message) => handler(message);
}

export function establishConnection(): void {
	if (!handleMessage) {
		throw new Error("WebSocket not initialized. Call init(queryClient) first.");
	}

	if (connectionStatus === "connecting" || connectionStatus === "connected") {
		return;
	}

	connection?.close();

	const protocol = window.location.protocol === "https:" ? "wss" : "ws";

	connection = new window.WebSocket(`${protocol}://${window.location.host}/ws`);
	connectionStatus = "connecting";

	connection.onopen = () => {
		interval = 500;
		connectionStatus = "connected";
	};

	connection.onmessage = (e) => {
		try {
			const parsed = WsMessageSchema.safeParse(JSON.parse(e.data));

			if (parsed.success) {
				handleMessage?.(parsed.data);
			} else {
				window.console.warn("Invalid WebSocket message", parsed.error);
			}
		} catch (error) {
			window.console.error("Failed to parse WebSocket message", error);
		}
	};

	connection.onclose = (e) => {
		if (interval < 15000) {
			interval += 500;
		}

		if (e.code === 4000) {
			resetClient();
		}

		setTimeout(() => {
			establishConnection();
			connectionStatus = "reconnecting";
		}, interval);
	};
}

export function getConnectionStatus(): ConnectionStatus {
	return connectionStatus;
}
