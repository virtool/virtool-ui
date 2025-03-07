import { QueryClientConfig } from "@tanstack/react-query";

export type WebSocket = {
    queryClient: QueryClientConfig;
    connectionStatus: string;
    establishConnection: () => void;
};
//
// export declare global {
//     interface Window {
//         virtool: virtoolState;
//         captureException?: (error: Error) => void;
//         msalInstance: IPublicClientApplication;
//         ws: WebSocket;
//     }
// }
