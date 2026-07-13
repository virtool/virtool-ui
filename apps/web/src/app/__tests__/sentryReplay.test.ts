import { beforeEach, describe, expect, it, vi } from "vitest";
import { scheduleReplay } from "../sentryReplay";

const addIntegration = vi.fn();
const replayIntegration = vi.fn(() => ({ name: "Replay" }));

vi.mock("@sentry/tanstackstart-react", () => ({
	getClient: () => ({ addIntegration }),
}));

vi.mock("@sentry/replay", () => ({
	replayIntegration: () => replayIntegration(),
}));

describe("scheduleReplay", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("does not register Replay synchronously", () => {
		vi.stubGlobal(
			"requestIdleCallback",
			vi.fn(() => 1),
		);

		scheduleReplay();

		expect(addIntegration).not.toHaveBeenCalled();
	});

	it("registers Replay once the browser goes idle", async () => {
		let idleCallback: (() => void) | undefined;
		vi.stubGlobal(
			"requestIdleCallback",
			vi.fn((callback: () => void) => {
				idleCallback = callback;
				return 1;
			}),
		);

		scheduleReplay();
		idleCallback?.();
		await vi.waitFor(() => expect(addIntegration).toHaveBeenCalledTimes(1));

		expect(replayIntegration).toHaveBeenCalledTimes(1);
	});

	it("falls back to a timeout where requestIdleCallback is unavailable", async () => {
		vi.stubGlobal("requestIdleCallback", undefined);

		scheduleReplay();
		await vi.waitFor(() => expect(addIntegration).toHaveBeenCalledTimes(1));
	});
});
