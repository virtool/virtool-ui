import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiGetGenbank } from "@tests/api/otus";
import { createFakeOtu } from "@tests/fake/otus";
import { createFakeReference } from "@tests/fake/references";
import { at, renderWithProviders } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CreateSequence from "../CreateSequence";

describe("<Accession> auto fill", () => {
	let otu: ReturnType<typeof createFakeOtu>;
	let reference: ReturnType<typeof createFakeReference>;

	function renderAccession() {
		const isolate = at(otu.isolates, 0);
		return renderWithProviders(
			<CreateSequence
				isolateId={isolate.id}
				open
				otuId={otu.id}
				refId={String(reference.id)}
				schema={otu.schema}
				sequences={isolate.sequences}
				setOpen={vi.fn()}
			/>,
		);
	}

	beforeEach(() => {
		reference = createFakeReference();
		otu = createFakeOtu();
	});

	afterEach(() => {
		window.sessionStorage.clear();
		nock.cleanAll();
	});

	it("should fill the form from the Genbank record", async () => {
		const scope = mockApiGetGenbank("NC_010317", {
			accession: "NC_010317",
			definition: "Abaca bunchy top virus DNA-R",
			host: "Musa textilis",
			sequence: "ATGRYKM",
		});

		renderAccession();

		await userEvent.type(
			await screen.findByRole("textbox", { name: "Accession (ID)" }),
			"NC_010317",
		);
		await userEvent.click(screen.getByRole("button", { name: "Auto Fill" }));

		await waitFor(() => scope.done());

		expect(screen.getByRole("textbox", { name: "Host" })).toHaveValue(
			"Musa textilis",
		);
		expect(screen.getByRole("textbox", { name: "Definition" })).toHaveValue(
			"Abaca bunchy top virus DNA-R",
		);
		expect(screen.getByRole("textbox", { name: /^Sequence/ })).toHaveValue(
			"ATGRYKM",
		);
	});

	it("should report an unknown accession and clear the error on retyping", async () => {
		const scope = mockApiGetGenbank("NC_000000", null);

		renderAccession();

		await userEvent.type(
			await screen.findByRole("textbox", { name: "Accession (ID)" }),
			"NC_000000",
		);
		await userEvent.click(screen.getByRole("button", { name: "Auto Fill" }));

		await waitFor(() => scope.done());

		expect(await screen.findByText("Accession not found")).toBeInTheDocument();

		await userEvent.type(
			screen.getByRole("textbox", { name: "Accession (ID)" }),
			"1",
		);

		expect(screen.queryByText("Accession not found")).not.toBeInTheDocument();
	});
});
