import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiGetSubtractions } from "@tests/api/subtractions";
import { createFakeAccount } from "@tests/fake/account";
import { createFakeSubtractionMinimal } from "@tests/fake/subtractions";
import { mockGetAccount } from "@tests/server-fn/users";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import SubtractionList from "../SubtractionList";

type SubtractionListSearch = {
	find?: string;
	page?: number;
};

function SubtractionListHarness() {
	const [search, setSearch] = useState<SubtractionListSearch>({ find: "" });

	function handleSetSearch(next: SubtractionListSearch) {
		setSearch((prev) => ({ ...prev, ...next }));
	}

	return <SubtractionList {...search} setSearch={handleSetSearch} />;
}

describe("<SubtractionList />", () => {
	let subtractions: ReturnType<typeof createFakeSubtractionMinimal>;

	beforeEach(() => {
		subtractions = createFakeSubtractionMinimal();
	});

	// Without this, an interceptor a test doesn't consume is left to satisfy the
	// next test's request, and that test's own scope never fires.
	afterEach(() => nock.cleanAll());

	it("renders correctly", async () => {
		const scope = mockApiGetSubtractions([subtractions]);
		await renderWithRouter(<SubtractionList />);

		await waitFor(() =>
			expect(screen.queryByLabelText("loading")).not.toBeInTheDocument(),
		);

		expect(screen.getByText("Subtractions")).toBeInTheDocument();
		expect(screen.getByText("1")).toBeInTheDocument();
		expect(screen.getByText(subtractions.name)).toBeInTheDocument();

		scope.done();
	});

	it("should call handleChange when search input changes in toolbar", async () => {
		// The initial empty-term render, the debounced commit of "Foo", and the
		// refetch when clearing returns the term to empty.
		const scope = mockApiGetSubtractions([subtractions]);
		mockApiGetSubtractions([subtractions]);
		mockApiGetSubtractions([subtractions]);
		await renderWithRouter(<SubtractionListHarness />);
		await waitFor(() =>
			expect(screen.queryByLabelText("loading")).not.toBeInTheDocument(),
		);

		const inputElement = screen.getByPlaceholderText("Name");
		expect(inputElement).toHaveValue("");

		await userEvent.type(inputElement, "Foo");
		expect(inputElement).toHaveValue("Foo");

		await userEvent.clear(inputElement);
		scope.done();
	});

	it("should render create button when [canModify=true]", async () => {
		const scope = mockApiGetSubtractions([subtractions]);
		const account = createFakeAccount({
			administrator_role: "full",
		});
		mockGetAccount(account);
		await renderWithRouter(<SubtractionList />);
		await waitFor(() =>
			expect(screen.queryByLabelText("loading")).not.toBeInTheDocument(),
		);

		expect(
			await screen.findByRole("button", { name: "Create" }),
		).toBeInTheDocument();

		scope.done();
	});

	it("should not render create button when [canModify=false]", async () => {
		const scope = mockApiGetSubtractions([subtractions]);
		const account = createFakeAccount({ administrator_role: null });
		mockGetAccount(account);
		await renderWithRouter(<SubtractionList />);
		await waitFor(() =>
			expect(screen.queryByLabelText("loading")).not.toBeInTheDocument(),
		);

		const createButton = screen.queryByLabelText("Create");
		expect(createButton).toBeNull();

		scope.done();
	});

	it("should handle toolbar updates correctly", async () => {
		// The initial empty-term render plus the debounced commit of "Foobar".
		const scope = mockApiGetSubtractions([subtractions]);
		mockApiGetSubtractions([subtractions]);
		await renderWithRouter(<SubtractionListHarness />);
		await waitFor(() =>
			expect(screen.queryByLabelText("loading")).not.toBeInTheDocument(),
		);

		const inputElement = screen.getByPlaceholderText("Name");
		expect(inputElement).toHaveValue("");

		await userEvent.type(inputElement, "Foobar");
		expect(inputElement).toHaveValue("Foobar");
		expect(screen.getByPlaceholderText("Name")).toHaveValue("Foobar");

		scope.done();
	});
});
