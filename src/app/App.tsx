import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import AppRouter from "./AppRouter";
import { resetClient } from "./utils";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: (failureCount: number, error: any) => {
				if ([403, 404].includes(error.response?.status)) {
					return false;
				}
				if (error.response?.status === 401) {
					resetClient();
				}
				return failureCount <= 3;
			},
			staleTime: 2000,
		},
	},
});

export default function App(): ReactElement {
	return (
		<QueryClientProvider client={queryClient}>
			<AppRouter />
		</QueryClientProvider>
	);
}
