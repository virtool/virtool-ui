import { WebSocket } from "@/types/types";
import { IPublicClientApplication } from "@azure/msal-browser";
import { Store } from "redux";

export declare global {
    interface Window {
        virtool: virtoolState;
        captureException?: (error: Error) => void;
        store: Store;
        msalInstance: IPublicClientApplication;
        ws: WebSocket;
    }
}
