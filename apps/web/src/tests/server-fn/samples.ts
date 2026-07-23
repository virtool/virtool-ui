import type { Sample, SampleMinimal } from "@samples/types";
import { type Mock, vi } from "vitest";
import { createFakeSample } from "../fake/samples";

/**
 * Mock handles for the `@server/samples/functions` server-fn module. Wired in
 * globally from `tests/setup.tsx` so any test importing this helper can stub the
 * sample server functions without per-file `vi.mock` boilerplate.
 */
export const sampleServerFnMocks = {
	findSamples: vi.fn(),
	getSample: vi.fn(),
	createSample: vi.fn(),
	updateSample: vi.fn(),
	deleteSample: vi.fn(),
	updateSampleRights: vi.fn(),
};

/**
 * Sets up findSamples to resolve with a single page of the given samples.
 *
 * @param samples - the samples on the page
 * @param counts - overrides for the counts, which otherwise both match the
 *   number of samples. `totalCount` is every sample the user may see and
 *   `foundCount` is only those matching the filters.
 */
export function mockGetSamples(
	samples: SampleMinimal[],
	counts: { foundCount?: number; totalCount?: number } = {},
): Mock {
	sampleServerFnMocks.findSamples.mockResolvedValue({
		page: 1,
		pageCount: 1,
		perPage: 5,
		totalCount: counts.totalCount ?? samples.length,
		foundCount: counts.foundCount ?? samples.length,
		items: samples,
	});
	return sampleServerFnMocks.findSamples;
}

/**
 * Sets up findSamples to serve one page per entry in `pages`, selecting by the
 * requested `page`, so a selection made on one page can be asserted from
 * another.
 *
 * @param pages - the samples on each page, in page order
 */
export function mockGetSamplePages(pages: SampleMinimal[][]): Mock {
	sampleServerFnMocks.findSamples.mockImplementation(
		async ({ data }: { data?: { page?: number } }) => {
			const page = data?.page ?? 1;
			return {
				page,
				pageCount: pages.length,
				perPage: 1,
				totalCount: pages.length,
				foundCount: pages.length,
				items: pages[page - 1] ?? [],
			};
		},
	);
	return sampleServerFnMocks.findSamples;
}

/** Sets up getSample to resolve with the given sample. */
export function mockGetSampleDetail(sample: Sample): Mock {
	sampleServerFnMocks.getSample.mockResolvedValue(sample);
	return sampleServerFnMocks.getSample;
}

/** Sets up createSample to resolve with the given (or a fake) sample. */
export function mockCreateSample(sample?: Sample): Mock {
	sampleServerFnMocks.createSample.mockResolvedValue(
		sample ?? createFakeSample(),
	);
	return sampleServerFnMocks.createSample;
}

/** Sets up updateSample to resolve with the given sample, patched with the fields. */
export function mockEditSample(
	sample: Sample,
	update: Partial<Sample> = {},
): Mock {
	sampleServerFnMocks.updateSample.mockResolvedValue({ ...sample, ...update });
	return sampleServerFnMocks.updateSample;
}

/** Sets up deleteSample to resolve. */
export function mockRemoveSample(): Mock {
	sampleServerFnMocks.deleteSample.mockResolvedValue(null);
	return sampleServerFnMocks.deleteSample;
}

/** Sets up updateSampleRights to resolve with the given sample, patched with the fields. */
export function mockUpdateSampleRights(
	sample: Sample,
	update: Partial<Sample> = {},
): Mock {
	sampleServerFnMocks.updateSampleRights.mockResolvedValue({
		...sample,
		...update,
	});
	return sampleServerFnMocks.updateSampleRights;
}
