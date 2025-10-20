import { QueryClientConfig } from "@tanstack/react-query";

export type VirtoolState = {
    sentryDsn: string;
    version: string;
};

export type WebSocket = {
    queryClient: QueryClientConfig;
    connectionStatus: string;
    establishConnection: () => void;
};

declare global {
    interface Window {
        captureException?: (error: Error) => void;
        virtool: VirtoolState;
        ws: WebSocket;
    }
}
