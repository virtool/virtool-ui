import { accountQueryKeys } from "@account/keys";
import { waitFor } from "@testing-library/react";
import { mockApiGetAccountUnauthorized } from "@tests/fake/account";
import { renderRoute } from "@tests/setup";
import nock from "nock";
import { afterEach, describe, expect, it } from "vitest";

describe("<AuthenticatedLayout />", () => {
	afterEach(() => nock.cleanAll());

	it("redirects to /login when the account is not authenticated", async () => {
		mockApiGetAccountUnauthorized();

		const { router } = await renderRoute("/samples", {
			seed: (queryClient) => {
				queryClient.removeQueries({ queryKey: accountQueryKeys.all() });
			},
		});

		await waitFor(() => {
			expect(router.state.location.pathname).toBe("/login");
		});
		expect(router.state.location.search).toMatchObject({
			redirect: "/samples",
		});
	});
});
