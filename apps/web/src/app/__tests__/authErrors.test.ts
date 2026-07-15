import { authErrorSerializationAdapter } from "@app/authErrors";
import {
	FORBIDDEN_ERROR_NAME,
	UNAUTHORIZED_ERROR_NAME,
} from "@virtool/contracts";
import { describe, expect, it } from "vitest";

function namedError(name: string, message: string): Error {
	const error = new Error(message);
	error.name = name;
	return error;
}

describe("authErrorSerializationAdapter", () => {
	it("matches the auth errors by name", () => {
		expect(
			authErrorSerializationAdapter.test(
				namedError(UNAUTHORIZED_ERROR_NAME, "Unauthorized"),
			),
		).toBe(true);
		expect(
			authErrorSerializationAdapter.test(
				namedError(FORBIDDEN_ERROR_NAME, "Forbidden"),
			),
		).toBe(true);
	});

	it("leaves every other error to the default ShallowErrorPlugin", () => {
		expect(authErrorSerializationAdapter.test(new Error("boom"))).toBe(false);
		expect(
			authErrorSerializationAdapter.test(namedError("ZodError", "invalid")),
		).toBe(false);
		expect(
			authErrorSerializationAdapter.test({ name: UNAUTHORIZED_ERROR_NAME }),
		).toBe(false);
		expect(authErrorSerializationAdapter.test("Unauthorized")).toBe(false);
	});

	it("round-trips an auth error with its name intact", () => {
		const serialized = authErrorSerializationAdapter.toSerializable(
			namedError(UNAUTHORIZED_ERROR_NAME, "Unauthorized"),
		);
		expect(serialized).toEqual({
			name: UNAUTHORIZED_ERROR_NAME,
			message: "Unauthorized",
		});

		const restored = authErrorSerializationAdapter.fromSerializable(serialized);
		expect(restored).toBeInstanceOf(Error);
		expect(restored.name).toBe(UNAUTHORIZED_ERROR_NAME);
		expect(restored.message).toBe("Unauthorized");
	});
});
