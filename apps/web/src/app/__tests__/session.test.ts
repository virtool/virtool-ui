import { beforeEach, describe, expect, it, vi } from "vitest";

const assign = vi.fn();

function setLocation(pathname: string, search = "") {
	Object.defineProperty(window, "location", {
		configurable: true,
		value: { assign, pathname, search },
	});
}

// `armed` and `ended` are module state, so every test needs a fresh copy.
async function loadSession() {
	vi.resetModules();
	return import("../session");
}

describe("endSession", () => {
	beforeEach(() => {
		assign.mockClear();
		window.sessionStorage.clear();
		setLocation("/samples");
	});

	it("does nothing until an authenticated load has armed it", async () => {
		const { endSession } = await loadSession();

		endSession();

		expect(assign).not.toHaveBeenCalled();
	});

	it("sends the user to the login wall with a reason and a way back", async () => {
		const { armSessionEnd, endSession } = await loadSession();
		setLocation("/samples", "?find=foo");

		armSessionEnd();
		endSession();

		expect(assign).toHaveBeenCalledWith(
			"/login?reason=session-ended&redirect=%2Fsamples%3Ffind%3Dfoo",
		);
	});

	it("clears session storage so no draft outlives the session", async () => {
		const { armSessionEnd, endSession } = await loadSession();
		window.sessionStorage.setItem("draft", "unsaved");

		armSessionEnd();
		endSession();

		expect(window.sessionStorage.getItem("draft")).toBeNull();
	});

	it("does not point the login wall back at itself", async () => {
		const { armSessionEnd, endSession } = await loadSession();
		setLocation("/login");

		armSessionEnd();
		endSession();

		expect(assign).toHaveBeenCalledWith("/login?reason=session-ended");
	});

	it("ends the session once, however many 401s arrive", async () => {
		const { armSessionEnd, endSession } = await loadSession();

		armSessionEnd();
		endSession();
		endSession();

		expect(assign).toHaveBeenCalledTimes(1);
	});
});
