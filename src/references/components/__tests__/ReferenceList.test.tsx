import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakePermissions } from "@tests/fake/permissions";
import {
	createFakeReferenceMinimal,
	mockApiCloneReference,
	mockApiGetReferences,
} from "@tests/fake/references";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import ReferenceList from "../ReferenceList";

type ReferenceListSearch = {
	cloneReferenceId?: string;
	createReferenceType?: string;
	find?: string;
	page?: number;
};

function ReferenceListHarness() {
	const [search, setSearch] = useState<ReferenceListSearch>({
		cloneReferenceId: undefined,
		find: "",
	});

	function handleSetSearch(next: ReferenceListSearch) {
		setSearch((prev) => ({ ...prev, ...next }));
	}

	return <ReferenceList {...search} setSearch={handleSetSearch} />;
}

describe("<ReferenceList />", () => {
	let references: ReturnType<typeof createFakeReferenceMinimal>;

	beforeEach(() => {
		references = createFakeReferenceMinimal();
	});

	afterEach(() => nock.cleanAll());

	it("should render correctly", async () => {
		const permissions = createFakePermissions({ create_ref: true });
		const account = createFakeAccount({ permissions: permissions });
		mockApiGetAccount(account);
		const scope = mockApiGetReferences([references]);
		await renderWithRouter(<ReferenceList />);

		expect(await screen.findByText("References")).toBeInTheDocument();
		expect(screen.getByText(references.name)).toBeInTheDocument();
		expect(
			screen.getByText(`${references.user.handle} created`),
		).toBeInTheDocument();

		expect(
			await screen.findByRole("button", { name: "clone" }),
		).toBeInTheDocument();
		expect(screen.getByLabelText("clone")).toBeInTheDocument();

		scope.done();
	});

	describe("<ReferenceToolbar />", () => {
		it("should render when toolbar term is changed to foo", async () => {
			const scope = mockApiGetReferences([references]);
			mockApiGetReferences([references]);
			mockApiGetReferences([references]);
			mockApiGetReferences([references]);
			await renderWithRouter(<ReferenceListHarness />);

			expect(await screen.findByText("References")).toBeInTheDocument();

			const inputElement = screen.getByPlaceholderText("Reference name");
			expect(inputElement).toHaveValue("");

			await userEvent.type(inputElement, "Foo");
			expect(await screen.findByDisplayValue("Foo")).toBeInTheDocument();

			await userEvent.clear(screen.getByRole("textbox"));
			scope.done();
		});

		it("should not render creation button when [canCreate=false]", async () => {
			const permissions = createFakePermissions({ create_ref: false });
			const account = createFakeAccount({ permissions: permissions });
			mockApiGetAccount(account);
			const scope = mockApiGetReferences([references]);
			await renderWithRouter(<ReferenceList />);

			expect(await screen.findByText("References")).toBeInTheDocument();
			expect(
				screen.queryByRole("link", { name: "Create" }),
			).not.toBeInTheDocument();

			scope.done();
		});

		it("should handle toolbar updates correctly", async () => {
			const scope = mockApiGetReferences([references]);
			mockApiGetReferences([references]);
			mockApiGetReferences([references]);
			mockApiGetReferences([references]);
			mockApiGetReferences([references]);
			mockApiGetReferences([references]);
			mockApiGetReferences([references]);
			await renderWithRouter(<ReferenceListHarness />);

			expect(await screen.findByText("References")).toBeInTheDocument();

			const inputElement = screen.getByPlaceholderText("Reference name");
			expect(inputElement).toHaveValue("");

			await userEvent.type(inputElement, "Foobar");
			expect(await screen.findByDisplayValue("Foobar")).toBeInTheDocument();

			scope.done();
		});
	});

	describe("<CloneReference />", () => {
		it("handleSubmit() should mutate with correct input", async () => {
			const permissions = createFakePermissions({ create_ref: true });
			const account = createFakeAccount({ permissions: permissions });
			mockApiGetAccount(account);
			const getReferencesScope = mockApiGetReferences([references]);
			const cloneReferenceScope = mockApiCloneReference(
				`Clone of ${references.name}`,
				`Cloned from ${references.name}`,
				references,
			);
			await renderWithRouter(<ReferenceListHarness />);

			expect(await screen.findByText("References")).toBeInTheDocument();
			await userEvent.click(
				await screen.findByRole("button", { name: "clone" }),
			);
			await userEvent.click(screen.getByRole("button", { name: "Clone" }));

			getReferencesScope.done();
			cloneReferenceScope.done();
		});

		it("handleSubmit() should mutate with changed input", async () => {
			const permissions = createFakePermissions({ create_ref: true });
			const account = createFakeAccount({ permissions: permissions });
			mockApiGetAccount(account);
			const getReferencesScope = mockApiGetReferences([references]);
			const cloneReferenceScope = mockApiCloneReference(
				"newName",
				`Cloned from ${references.name}`,
				references,
			);
			await renderWithRouter(<ReferenceListHarness />);

			expect(await screen.findByText("References")).toBeInTheDocument();
			await userEvent.click(
				await screen.findByRole("button", { name: "clone" }),
			);
			await userEvent.clear(screen.getByRole("textbox"));
			await userEvent.type(screen.getByRole("textbox"), "newName");
			await userEvent.click(screen.getByRole("button", { name: "Clone" }));

			getReferencesScope.done();
			cloneReferenceScope.done();
		});

		it("should display an error when name input is cleared", async () => {
			const permissions = createFakePermissions({ create_ref: true });
			const account = createFakeAccount({ permissions: permissions });
			mockApiGetAccount(account);
			const scope = mockApiGetReferences([references]);
			await renderWithRouter(<ReferenceListHarness />);

			expect(await screen.findByText("References")).toBeInTheDocument();
			await userEvent.click(
				await screen.findByRole("button", { name: "clone" }),
			);
			await userEvent.clear(screen.getByRole("textbox"));
			await userEvent.click(screen.getByRole("button", { name: "Clone" }));
			expect(screen.getByText("Required Field")).toBeInTheDocument();

			scope.done();
		});
	});
});
