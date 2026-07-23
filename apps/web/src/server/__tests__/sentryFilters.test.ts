import type { ErrorEvent, EventHint } from "@sentry/tanstackstart-react";
import {
	CLIENT_ERROR_NAME,
	FORBIDDEN_ERROR_NAME,
	UNAUTHORIZED_ERROR_NAME,
} from "@virtool/contracts";
import { describe, expect, it } from "vitest";

import { ClientError } from "../errors";
import { dropExpectedClientErrors } from "../sentryFilters";

function namedError(name: string, message: string): Error {
	const error = new Error(message);
	error.name = name;
	return error;
}

function eventWithType(type: string): ErrorEvent {
	return { exception: { values: [{ type }] } } as ErrorEvent;
}

describe("dropExpectedClientErrors", () => {
	it("drops an event whose original exception is an UnauthorizedError", () => {
		const result = dropExpectedClientErrors(
			{} as ErrorEvent,
			{
				originalException: namedError(UNAUTHORIZED_ERROR_NAME, "Unauthorized"),
			} as EventHint,
		);

		expect(result).toBeNull();
	});

	it("drops an event whose original exception is a ForbiddenError", () => {
		const result = dropExpectedClientErrors(
			{} as ErrorEvent,
			{
				originalException: namedError(FORBIDDEN_ERROR_NAME, "Forbidden"),
			} as EventHint,
		);

		expect(result).toBeNull();
	});

	it("drops an event whose original exception is a ClientError", () => {
		const result = dropExpectedClientErrors(
			{} as ErrorEvent,
			{
				originalException: new ClientError("Invalid handle or password."),
			} as EventHint,
		);

		expect(result).toBeNull();
	});

	it("drops an event that reports an expected error type when the original exception is absent", () => {
		const event = eventWithType(UNAUTHORIZED_ERROR_NAME);

		expect(dropExpectedClientErrors(event, {} as EventHint)).toBeNull();
	});

	it("drops an event that reports a ClientError type when the original exception is absent", () => {
		const event = eventWithType(CLIENT_ERROR_NAME);

		expect(dropExpectedClientErrors(event, {} as EventHint)).toBeNull();
	});

	it("keeps an unrelated error event", () => {
		const event = eventWithType("TypeError");
		const hint = { originalException: new TypeError("boom") } as EventHint;

		expect(dropExpectedClientErrors(event, hint)).toBe(event);
	});

	it("keeps an event with no exception details", () => {
		const event = {} as ErrorEvent;

		expect(dropExpectedClientErrors(event, {} as EventHint)).toBe(event);
	});
});
