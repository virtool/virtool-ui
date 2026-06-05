import { create } from "zustand";

/** State for the store holding the version reported by the running SSR service. */
type ServerVersionState = {
	/** The version of the running SSR service, or null until it is first reported. */
	version: string | null;

	/** Record the SSR version reported over the SSE stream. */
	setVersion: (version: string) => void;
};

/**
 * Zustand store holding the version reported by the running SSR service.
 *
 * The version arrives over the SSE stream on connect, so it reflects the
 * deployment currently serving the app — which can differ from the build the
 * client is running (`__APP_VERSION__`) after a redeploy.
 */
export const useServerVersionStore = create<ServerVersionState>((set) => ({
	version: null,
	setVersion: (version) => set({ version }),
}));
