import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import {
	mockApiCreateSample,
	mockApiCreateSampleFailure,
} from "@tests/fake/samples";
import { fileQueryKeys } from "@uploads/keys";
import nock from "nock";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCreateSample, useCreateSamples } from "../queries";
import type { CreateSampleRequest } from "../types";

describe("useCreateSample()", () => {
	afterEach(() => nock.cleanAll());

	it("invalidates the uploads lists on success so reserved files leave the selector", async () => {
		const queryClient = new QueryClient();
		const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

		const scope = mockApiCreateSample(
			"Sample A",
			"",
			"",
			"",
			"normal",
			[1],
			[],
			[],
			null,
		);

		function wrapper({ children }: { children: ReactNode }) {
			return (
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			);
		}

		const { result } = renderHook(() => useCreateSample(), { wrapper });

		result.current.mutate({
			name: "Sample A",
			isolate: "",
			host: "",
			locale: "",
			libraryType: "normal",
			subtractions: [],
			files: [1],
			labels: [],
			group: null,
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(invalidateQueries).toHaveBeenCalledWith({
			queryKey: fileQueryKeys.lists(),
		});

		scope.done();
	});
});

describe("useCreateSamples()", () => {
	afterEach(() => nock.cleanAll());

	function getRequest(name: string, files: number[]): CreateSampleRequest {
		return {
			files,
			group: null,
			host: "",
			isolate: "",
			labels: [],
			libraryType: "normal",
			locale: "",
			name,
			subtractions: [],
		};
	}

	function renderCreateSamples(queryClient: QueryClient) {
		function wrapper({ children }: { children: ReactNode }) {
			return (
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			);
		}

		return renderHook(() => useCreateSamples(), { wrapper });
	}

	it("reports an outcome for each sample, in the order they were requested", async () => {
		const first = mockApiCreateSample(
			"Sample A",
			"",
			"",
			"",
			"normal",
			[1],
			[],
			[],
			null,
		);
		const second = mockApiCreateSample(
			"Sample B",
			"",
			"",
			"",
			"normal",
			[2],
			[],
			[],
			null,
		);

		const { result } = renderCreateSamples(new QueryClient());

		result.current.mutate([
			getRequest("Sample A", [1]),
			getRequest("Sample B", [2]),
		]);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(result.current.data).toMatchObject([
			{ status: "created", sample: { name: "Sample A" } },
			{ status: "created", sample: { name: "Sample B" } },
		]);

		first.done();
		second.done();
	});

	it("keeps the samples that were created when one of them is rejected", async () => {
		const created = mockApiCreateSample(
			"Sample A",
			"",
			"",
			"",
			"normal",
			[1],
			[],
			[],
			null,
		);
		const rejected = mockApiCreateSampleFailure(
			"Sample B",
			"Name already in use",
		);

		const { result } = renderCreateSamples(new QueryClient());

		result.current.mutate([
			getRequest("Sample A", [1]),
			getRequest("Sample B", [2]),
		]);

		// The batch itself succeeds: a rejected sample is an outcome, not an error,
		// so the samples that were created aren't lost with it.
		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(result.current.data).toMatchObject([
			{ status: "created", sample: { name: "Sample A" } },
			{ status: "failed", message: "Name already in use" },
		]);

		created.done();
		rejected.done();
	});

	it("invalidates the uploads lists even when a sample is rejected", async () => {
		const queryClient = new QueryClient();
		const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

		const rejected = mockApiCreateSampleFailure(
			"Sample A",
			"Name already in use",
		);

		const { result } = renderCreateSamples(queryClient);

		result.current.mutate([getRequest("Sample A", [1])]);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(invalidateQueries).toHaveBeenCalledWith({
			queryKey: fileQueryKeys.lists(),
		});

		rejected.done();
	});
});
