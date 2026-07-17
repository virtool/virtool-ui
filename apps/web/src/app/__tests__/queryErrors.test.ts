import {
	handleAuthenticationError,
	type QueryError,
	shouldRetryQuery,
} from "@app/queryErrors";
import {
	FORBIDDEN_ERROR_NAME,
	UNAUTHORIZED_ERROR_NAME,
} from "@virtool/contracts";
import { afterEach, describe, expect, it, vi } from "vitest";

const { endSession } = vi.hoisted(() => ({ endSession: vi.fn() }));

vi.mock("@app/session", () => ({
	armSessionEnd: vi.fn(),
	endSession,
}));

// The auth errors arrive rebuilt by `authErrorSerializationAdapter`, which
// carries `name` but nothing else — so a plain Error with the name set is
// exactly what these functions see in production.
function serializedAuthError(name: string, message: string): Error {
	const error = new Error(message);
	error.name = name;
	return error;
}

function superagentError(status: number): QueryError {
	return Object.assign(new Error(`Request failed: ${status}`), {
		response: { status },
	});
}

describe("shouldRetryQuery", () => {
	it.each([
		401, 403, 404,
	])("gives up immediately on a %i from the Python API", (status) => {
		expect(shouldRetryQuery(0, superagentError(status))).toBe(false);
	});

	it("retries a Python API failure that may yet succeed", () => {
		expect(shouldRetryQuery(0, superagentError(500))).toBe(true);
	});

	it.each([
		UNAUTHORIZED_ERROR_NAME,
		FORBIDDEN_ERROR_NAME,
	])("gives up immediately on a server function's %s", (name) => {
		expect(shouldRetryQuery(0, serializedAuthError(name, name))).toBe(false);
	});

	it("keeps retrying an auth error whose name was lost in serialization", () => {
		// Guards the adapter's whole reason for existing: without `name`, an
		// UnauthorizedError is indistinguishable from a transient failure and is
		// retried ~4× over ~15s before the user reaches the login wall. See
		// VIR-2783 for the end-to-end coverage this cannot provide.
		expect(shouldRetryQuery(0, new Error("Unauthorized"))).toBe(true);
	});

	it("retries an unrecognized failure a bounded number of times", () => {
		const error = new Error("network down");

		expect(shouldRetryQuery(3, error)).toBe(true);
		expect(shouldRetryQuery(4, error)).toBe(false);
	});
});

describe("handleAuthenticationError", () => {
	afterEach(() => {
		endSession.mockClear();
	});

	it("ends the session when a server function rejects the session", () => {
		handleAuthenticationError(
			serializedAuthError(UNAUTHORIZED_ERROR_NAME, "Unauthorized"),
		);

		expect(endSession).toHaveBeenCalledTimes(1);
	});

	it("leaves the session alone when the user merely lacks the role", () => {
		handleAuthenticationError(
			serializedAuthError(FORBIDDEN_ERROR_NAME, "Forbidden"),
		);

		expect(endSession).not.toHaveBeenCalled();
	});

	it("leaves the session alone when a query fails for any other reason", () => {
		handleAuthenticationError(new Error("network down"));

		expect(endSession).not.toHaveBeenCalled();
	});
});
