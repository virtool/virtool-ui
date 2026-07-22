import type { Hmm, ServerHmmSearchResults } from "@hmm/types";
import { type Mock, vi } from "vitest";

/**
 * Mock handles for the `@server/hmm/functions` server-fn module. Wired in
 * globally from `tests/setup.tsx` so any test rendering an HMM view can stub
 * these without per-file `vi.mock` boilerplate.
 */
export const hmmServerFnMocks = {
	findHmms: vi.fn(),
	getHmm: vi.fn(),
	installHmm: vi.fn(),
};

/** Sets up findHmms to resolve with the given search results. */
export function mockFindHmms(searchResults: ServerHmmSearchResults): Mock {
	hmmServerFnMocks.findHmms.mockResolvedValue(searchResults);
	return hmmServerFnMocks.findHmms;
}

/** Sets up getHmm to resolve with the given HMM. */
export function mockGetHmm(hmm: Hmm): Mock {
	hmmServerFnMocks.getHmm.mockResolvedValue(hmm);
	return hmmServerFnMocks.getHmm;
}

/**
 * Sets up getHmm to reject with an error carrying the given HTTP status, the way
 * a server function surfaces a 404 to the client.
 */
export function mockGetHmmError(status: number): Mock {
	hmmServerFnMocks.getHmm.mockRejectedValue(
		Object.assign(new Error("HMM not found."), { status }),
	);
	return hmmServerFnMocks.getHmm;
}
