import { resetClient } from "@utils/utils";
import { reactQueryHandler } from "./reactQueryHandler";

export const INITIALIZING = "initializing";
export const CONNECTING = "connecting";
export const CONNECTED = "connected";
export const ABANDONED = "abandoned";
export const RECONNECTING = "reconnecting";

export default function WSConnection(queryClient) {
    this.reactQueryHandler = reactQueryHandler(queryClient);

    // When a websocket message is received, this method is called with the message as the sole argument. Every message
    // has a property "operation" that tells the dispatcher what to do. Illegal operation names will throw an error.
    this.handle = message => {
        this.reactQueryHandler(message);
    };

    this.interval = 500;
    this.connectionStatus = INITIALIZING;

    this.establishConnection = () => {
        const protocol = window.location.protocol === "https:" ? "wss" : "ws";

        this.connection = new window.WebSocket(`${protocol}://${window.location.host}/ws`);
        this.connectionStatus = CONNECTING;

        this.connection.onopen = () => {
            this.interval = 500;
            this.connectionStatus = CONNECTED;
        };

        this.connection.onmessage = e => {
            this.handle(JSON.parse(e.data));
        };

        this.connection.onclose = e => {
            if (this.interval < 15000) {
                this.interval += 500;
            }

            if (e.code === 4000) {
                resetClient();
            }

            setTimeout(() => {
                this.establishConnection();
                this.connectionStatus = RECONNECTING;
            }, this.interval);
        };
    };
}
