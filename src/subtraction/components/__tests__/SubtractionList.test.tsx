import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import {
	createFakeSubtractionMinimal,
	mockApiGetSubtractions,
} from "@tests/fake/subtractions";
import { renderWithRouter } from "@tests/setup";
import { useState } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import SubtractionList from "../SubtractionList";

type SubtractionListSearch = {
	find?: string;
	openCreateSubtraction?: boolean;
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
		const scope = mockApiGetSubtractions([subtractions]);
		mockApiGetSubtractions([subtractions]);
		mockApiGetSubtractions([subtractions]);
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
		mockApiGetAccount(account);
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
		mockApiGetAccount(account);
		await renderWithRouter(<SubtractionList />);
		await waitFor(() =>
			expect(screen.queryByLabelText("loading")).not.toBeInTheDocument(),
		);

		const createButton = screen.queryByLabelText("Create");
		expect(createButton).toBeNull();

		scope.done();
	});

	it("should handle toolbar updates correctly", async () => {
		const scope = mockApiGetSubtractions([subtractions]);
		mockApiGetSubtractions([subtractions]);
		mockApiGetSubtractions([subtractions]);
		mockApiGetSubtractions([subtractions]);
		mockApiGetSubtractions([subtractions]);
		mockApiGetSubtractions([subtractions]);
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
