import { QueryClientConfig } from "@tanstack/react-query";

export type ErrorResponse = {
    response: {
        status: number;
        notFound: boolean;
        statusText: string;
        badRequest: boolean;
        statusCode: number;
        body: { [key: string]: any };
    };
};

export type WebSocket = {
    queryClient: QueryClientConfig;
    connectionStatus: string;
    establishConnection: () => void;
};
