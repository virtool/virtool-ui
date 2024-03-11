import { Store } from "redux";

export declare global {
    interface Window {
        virtool: virtoolState;
        captureException?: (error: Error) => void;
        store: Store;
    }
}
