import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeOtu, mockApiAddSequence } from "@tests/fake/otus";
import { createFakeReference } from "@tests/fake/references";
import { renderWithProviders } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CreateSequence from "../CreateSequence";

describe("<CreateSequence>", () => {
	let otu: ReturnType<typeof createFakeOtu>;
	let reference: ReturnType<typeof createFakeReference>;

	function renderCreateSequence(setOpen = vi.fn()) {
		const isolate = otu.isolates[0];
		if (!isolate) {
			throw new Error("expected an isolate");
		}
		return renderWithProviders(
			<CreateSequence
				isolateId={isolate.id}
				open
				otuId={otu.id}
				refId={reference.id}
				schema={otu.schema}
				sequences={isolate.sequences}
				setOpen={setOpen}
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

	it("should update fields on typing", async () => {
		const isolate = otu.isolates[0];
		const segment = otu.schema[0];
		if (!isolate || !segment) {
			throw new Error("expected an isolate and a schema segment");
		}

		const scope = mockApiAddSequence(
			otu.id,
			isolate.id,
			"user_typed_accession",
			"user_typed_host",
			"user_typed_definition",
			"ATGRYKM",
			segment.name,
		);

		renderCreateSequence();

		expect(await screen.findByText("Segment")).toBeInTheDocument();
		expect(screen.getByRole("combobox")).toBeInTheDocument();
		expect(
			screen.getByRole("textbox", { name: "Accession (ID)" }),
		).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: "Host" })).toBeInTheDocument();
		expect(
			screen.getByRole("textbox", { name: "Definition" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("textbox", { name: /Sequence [0-9]/ }),
		).toBeInTheDocument();

		await userEvent.click(screen.getByRole("combobox"));
		await userEvent.click(
			await screen.findByRole("option", { name: segment.name }),
		);
		await userEvent.type(
			screen.getByRole("textbox", { name: "Accession (ID)" }),
			"user_typed_accession",
		);
		await userEvent.type(
			screen.getByRole("textbox", { name: "Host" }),
			"user_typed_host",
		);
		await userEvent.type(
			screen.getByRole("textbox", { name: "Definition" }),
			"user_typed_definition",
		);
		await userEvent.type(
			screen.getByRole("textbox", { name: "Sequence 0" }),
			"ATGRYKM",
		);
		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		await waitFor(() => scope.done());
	});

	it("should display errors when accession, definition, or sequence not defined", async () => {
		renderCreateSequence();

		await userEvent.click(await screen.findByRole("button", { name: "Save" }));

		expect(screen.getAllByText("Required Field").length).toBe(3);
	});

	it("should display specific error when sequence contains chars !== ATCGNRYKM", async () => {
		renderCreateSequence();

		await userEvent.type(
			await screen.findByRole("textbox", { name: /Sequence [0-9]/ }),
			"atbcq",
		);
		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		expect(
			screen.getByText(
				"Sequence should only contain the characters: ATCGNRYKM",
			),
		).toBeInTheDocument();
	});

	it("should clear form cache after submitting", async () => {
		const isolate = otu.isolates[0];
		const segment = otu.schema[0];
		if (!isolate || !segment) {
			throw new Error("expected an isolate and a schema segment");
		}

		const scope = mockApiAddSequence(
			otu.id,
			isolate.id,
			"user_typed_accession",
			"user_typed_host",
			"user_typed_definition",
			"ATGRYKM",
			segment.name,
		);

		renderCreateSequence();

		await userEvent.click(await screen.findByRole("combobox"));
		await userEvent.click(
			await screen.findByRole("option", { name: segment.name }),
		);
		await userEvent.type(
			screen.getByRole("textbox", { name: "Accession (ID)" }),
			"user_typed_accession",
		);
		await userEvent.type(
			screen.getByRole("textbox", { name: "Host" }),
			"user_typed_host",
		);
		await userEvent.type(
			screen.getByRole("textbox", { name: "Definition" }),
			"user_typed_definition",
		);
		await userEvent.type(
			screen.getByRole("textbox", { name: "Sequence 0" }),
			"ATGRYKM",
		);
		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		await waitFor(() => scope.done());

		window.sessionStorage.clear();
		cleanup();

		renderCreateSequence();

		expect(screen.queryByText("Resumed editing draft sequence.")).toBeNull();
	});
});
