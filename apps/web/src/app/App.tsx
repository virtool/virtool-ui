import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import AppRouter from "./AppRouter";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: (failureCount: number, error: any) => {
				const status = error.response?.status;
				if ([401, 403, 404].includes(status)) {
					return false;
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
