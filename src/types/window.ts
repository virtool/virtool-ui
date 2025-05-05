import { IPublicClientApplication } from "@azure/msal-browser";
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
        msalInstance: IPublicClientApplication;
        virtool: VirtoolState;
        ws: WebSocket;
    }
}
