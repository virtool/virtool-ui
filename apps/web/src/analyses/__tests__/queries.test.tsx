import { analysesQueryKeys } from "@analyses/keys";
import { samplesQueryKeys } from "@samples/keys";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import nock from "nock";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCreateAnalysis } from "../queries";

describe("useCreateAnalysis()", () => {
	afterEach(() => nock.cleanAll());

	it("narrows the analyses invalidation to the analysed sample", async () => {
		const queryClient = new QueryClient();
		const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

		const scope = nock("http://localhost")
			.post("/api/samples/sample-1/analyses")
			.reply(201, { id: "analysis-1" });

		function wrapper({ children }: { children: ReactNode }) {
			return (
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			);
		}

		const { result } = renderHook(() => useCreateAnalysis(), { wrapper });

		result.current.mutate({
			sampleId: "sample-1",
			workflow: "pathoscope_bowtie",
			refId: "ref-1",
			subtractionIds: [],
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(invalidateQueries).toHaveBeenCalledWith({
			queryKey: [...analysesQueryKeys.lists(), "sample-1"],
		});
		expect(invalidateQueries).not.toHaveBeenCalledWith({
			queryKey: analysesQueryKeys.lists(),
		});
		// The sample's workflow tags render from both its detail and its list
		// entry, so both are refreshed.
		expect(invalidateQueries).toHaveBeenCalledWith({
			queryKey: samplesQueryKeys.detail("sample-1"),
		});
		expect(invalidateQueries).toHaveBeenCalledWith({
			queryKey: samplesQueryKeys.lists(),
		});

		scope.done();
	});
});
