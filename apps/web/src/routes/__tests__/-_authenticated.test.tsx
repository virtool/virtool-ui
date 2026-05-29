import { isRedirect } from "@tanstack/react-router";
import { screen } from "@testing-library/react";
import { createFakeAccount } from "@tests/fake/account";
import { renderRoute } from "@tests/setup";
import { describe, expect, it, vi } from "vitest";
import { Route } from "../_authenticated";

// Mirrors the auth middleware's `UnauthorizedError`, which reaches the client as
// a plain `Error` with its `name` preserved across the server-function boundary.
function createUnauthorizedError() {
	const error = new Error("Unauthorized");
	error.name = "UnauthorizedError";
	return error;
}

// Drive the route's `beforeLoad` directly with a fake query client so the
// account fetch can be made to fail in a controlled way. `ensureQueryData` runs
// first for the root query (gated on `first_user`) and then for the account
// query — only the latter is made to reject. Returns the thrown redirect, or
// null when `beforeLoad` resolves without redirecting.
async function runBeforeLoad(accountError: Error | null) {
	const queryClient = {
		ensureQueryData: vi.fn(async ({ queryKey }: { queryKey: string[] }) => {
			if (queryKey[0] === "root") {
				return { first_user: false };
			}
			if (accountError) {
				throw accountError;
			}
			return createFakeAccount();
		}),
	};

	const beforeLoad = Route.options.beforeLoad as (
		args: unknown,
	) => Promise<void>;

	return beforeLoad({
		context: { queryClient },
		location: { href: "/samples" },
	}).then(
		() => null,
		(error: { options?: { to?: string; search?: Record<string, unknown> } }) =>
			error,
	);
}

describe("/_authenticated beforeLoad", () => {
	it("redirects to /login on an authentication failure", async () => {
		const result = await runBeforeLoad(createUnauthorizedError());

		expect(isRedirect(result)).toBe(true);
		expect(result?.options?.to).toBe("/login");
		expect(result?.options?.search).toMatchObject({ redirect: "/samples" });
	});

	it("does not redirect when the account fetch fails transiently", async () => {
		const result = await runBeforeLoad(new Error("Internal Server Error"));

		expect(result).toBeNull();
	});
});

describe("<AuthenticatedLayout />", () => {
	it("keeps rendering cached account data when a refetch fails transiently", async () => {
		// No account server function is mocked, so the background refetch fails
		// transiently. The cached account must keep the layout (and its nav)
		// mounted rather than bouncing the user to login.
		const { router } = await renderRoute("/samples", {
			account: createFakeAccount(),
		});

		expect(await screen.findByLabelText("User menu")).toBeInTheDocument();
		expect(router.state.location.pathname).toBe("/samples");
	});

	it("does not redirect to /login when an uncached account fetch fails transiently", async () => {
		const { router } = await renderRoute("/samples", {
			seed: (queryClient) => {
				queryClient.removeQueries({ queryKey: ["account"] });
			},
		});

		expect(router.state.location.pathname).toBe("/samples");
	});
});
