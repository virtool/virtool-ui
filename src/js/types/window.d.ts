import { QueryClientConfig } from "@tanstack/react-query";

export type WebSocket = {
    queryClient: QueryClientConfig;
    connectionStatus: string;
    establishConnection: () => void;
};

declare global {
    interface Window {
        captureException?: (error: Error) => void;
        msalInstance: IPublicClientApplication;
        virtool: virtoolState;
        ws: WebSocket;
    }
}
