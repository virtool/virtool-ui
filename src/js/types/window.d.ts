import { WebSocket } from "@/types/types";
import { IPublicClientApplication } from "@azure/msal-browser";

export declare global {
    interface Window {
        virtool: virtoolState;
        captureException?: (error: Error) => void;
        msalInstance: IPublicClientApplication;
        ws: WebSocket;
    }
}
