import type { ErrorEvent, EventHint } from "@sentry/tanstackstart-react";
import {
	FORBIDDEN_ERROR_NAME,
	UNAUTHORIZED_ERROR_NAME,
} from "@virtool/contracts";
import { describe, expect, it } from "vitest";

import { dropExpectedAuthErrors } from "../sentryFilters";

function authError(name: string): Error {
	const error = new Error(
		name === UNAUTHORIZED_ERROR_NAME ? "Unauthorized" : "Forbidden",
	);
	error.name = name;
	return error;
}

function eventWithType(type: string): ErrorEvent {
	return { exception: { values: [{ type }] } } as ErrorEvent;
}

describe("dropExpectedAuthErrors", () => {
	it("drops an event whose original exception is an UnauthorizedError", () => {
		const result = dropExpectedAuthErrors(
			{} as ErrorEvent,
			{
				originalException: authError(UNAUTHORIZED_ERROR_NAME),
			} as EventHint,
		);

		expect(result).toBeNull();
	});

	it("drops an event whose original exception is a ForbiddenError", () => {
		const result = dropExpectedAuthErrors(
			{} as ErrorEvent,
			{
				originalException: authError(FORBIDDEN_ERROR_NAME),
			} as EventHint,
		);

		expect(result).toBeNull();
	});

	it("drops an event that reports an auth error type when the original exception is absent", () => {
		const event = eventWithType(UNAUTHORIZED_ERROR_NAME);

		expect(dropExpectedAuthErrors(event, {} as EventHint)).toBeNull();
	});

	it("keeps an unrelated error event", () => {
		const event = eventWithType("TypeError");
		const hint = { originalException: new TypeError("boom") } as EventHint;

		expect(dropExpectedAuthErrors(event, hint)).toBe(event);
	});

	it("keeps an event with no exception details", () => {
		const event = {} as ErrorEvent;

		expect(dropExpectedAuthErrors(event, {} as EventHint)).toBe(event);
	});
});
