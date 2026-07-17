import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiGetSubtractions } from "@tests/api/subtractions";
import { createFakeAccount } from "@tests/fake/account";
import { createFakeSubtractionMinimal } from "@tests/fake/subtractions";
import { renderRoute } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("<SubtractionList />", () => {
	let subtractions: ReturnType<typeof createFakeSubtractionMinimal>;

	beforeEach(() => {
		subtractions = createFakeSubtractionMinimal();
	});

	afterEach(() => nock.cleanAll());

	it("renders correctly", async () => {
		const scope = mockApiGetSubtractions([subtractions]);

		await renderRoute("/subtractions");

		expect(
			await screen.findByRole("heading", { name: /Subtractions/ }),
		).toBeInTheDocument();
		expect(screen.getByText("1")).toBeInTheDocument();
		expect(screen.getByText(subtractions.name)).toBeInTheDocument();

		scope.done();
	});

	it("should put the search term in the url once typing settles", async () => {
		mockApiGetSubtractions([subtractions]);
		// The debounced term commits as one navigation, whose loader refetches.
		mockApiGetSubtractions([subtractions]);

		const { router } = await renderRoute("/subtractions");

		const inputElement = await screen.findByPlaceholderText("Name");
		expect(inputElement).toHaveValue("");

		await userEvent.type(inputElement, "Foo");

		// The input tracks the draft immediately, ahead of the url.
		expect(inputElement).toHaveValue("Foo");

		await waitFor(() =>
			expect(router.state.location.search).toMatchObject({
				term: "Foo",
			}),
		);
	});

	it("should render create button when [canModify=true]", async () => {
		const scope = mockApiGetSubtractions([subtractions]);
		const account = createFakeAccount({ administrator_role: "full" });

		await renderRoute("/subtractions", { account });

		expect(
			await screen.findByRole("button", { name: "Create" }),
		).toBeInTheDocument();

		scope.done();
	});

	it("should not render create button when [canModify=false]", async () => {
		const scope = mockApiGetSubtractions([subtractions]);
		const account = createFakeAccount({ administrator_role: null });

		await renderRoute("/subtractions", { account });

		expect(await screen.findByText(subtractions.name)).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "Create" })).toBeNull();

		scope.done();
	});
});
