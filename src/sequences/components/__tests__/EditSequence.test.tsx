import { formatPath } from "@app/hooks";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount } from "@tests/fake/account";
import {
	createFakeOTUSequence,
	createFakeOtu,
	mockApiEditSequence,
	mockApiGetOtu,
} from "@tests/fake/otus";
import {
	createFakeReference,
	mockApiGetReferenceDetail,
} from "@tests/fake/references";
import { renderRoute } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("<SequenceEdit>", () => {
	let props;
	let reference;
	let otu;
	let activeSequence;
	let path;

	beforeEach(() => {
		reference = createFakeReference();
		mockApiGetReferenceDetail(reference);
		otu = createFakeOtu();
		activeSequence = otu.isolates[0].sequences[0];
		mockApiGetOtu(otu);

		path = formatPath(`/refs/${reference.id}/otus/${otu.id}/otu`, {
			editSequenceId: activeSequence.id,
		});

		props = {
			activeSequence: createFakeOTUSequence({ sequence: "ACGY" }),
			isolateId: "test_isolate_id",
			otuId: "test_otu_id",
			hasSchema: true,
			segments: [],
			refId: "test_ref_id",
		};
	});

	afterEach(() => {
		window.sessionStorage.clear();
		nock.cleanAll();
	});

	it("should render all fields with current sequence data", async () => {
		const account = createFakeAccount({ administrator_role: "full" });
		await renderRoute(path, { account });

		expect(await screen.findByText("Segment")).toBeInTheDocument();
		expect(screen.getByRole("combobox")).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: "Accession (ID)" })).toHaveValue(
			props.initialAccession,
		);
		expect(screen.getByRole("textbox", { name: "Host" })).toHaveValue(
			props.initialHost,
		);
		expect(screen.getByRole("textbox", { name: "Definition" })).toHaveValue(
			props.initialDefinition,
		);
		expect(screen.getByRole("textbox", { name: /Sequence [0-9]/ })).toHaveValue(
			props.initialSequence,
		);
	});

	it("should submit correct data when all fields changed", async () => {
		const scope = mockApiEditSequence(
			otu.id,
			otu.isolates[0].id,
			activeSequence.id,
			"user_typed_accession",
			"user_typed_definition",
			"user_typed_host",
			"ACGRYKM",
			null,
		);
		const account = createFakeAccount({ administrator_role: "full" });
		await renderRoute(path, { account });

		await userEvent.click(await screen.findByRole("combobox"));
		await userEvent.click(screen.getByRole("option", { name: "None" }));
		await userEvent.clear(
			screen.getByRole("textbox", { name: "Accession (ID)" }),
		);
		await userEvent.type(
			screen.getByRole("textbox", { name: "Accession (ID)" }),
			"user_typed_accession",
		);
		await userEvent.clear(screen.getByRole("textbox", { name: "Host" }));
		await userEvent.type(
			screen.getByRole("textbox", { name: "Host" }),
			"user_typed_host",
		);
		await userEvent.clear(screen.getByRole("textbox", { name: "Definition" }));
		await userEvent.type(
			screen.getByRole("textbox", { name: "Definition" }),
			"user_typed_definition",
		);
		await userEvent.clear(
			screen.getByRole("textbox", { name: /Sequence [0-9]/ }),
		);
		await userEvent.type(
			screen.getByRole("textbox", { name: /Sequence [0-9]/ }),
			"ACGRYKM",
		);

		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		scope.done();
	});

	it("should display errors when accession, definition, or sequence not defined", async () => {
		const account = createFakeAccount({ administrator_role: "full" });
		await renderRoute(path, { account });

		await userEvent.clear(
			await screen.findByRole("textbox", { name: "Accession (ID)" }),
		);
		await userEvent.clear(screen.getByRole("textbox", { name: "Definition" }));
		await userEvent.clear(
			screen.getByRole("textbox", { name: /Sequence [0-9]/ }),
		);
		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		expect(screen.getAllByText("Required Field").length).toBe(3);
	});

	it("should display specific error when sequence contains chars !== ATCGNRYKM", async () => {
		const account = createFakeAccount({ administrator_role: "full" });
		await renderRoute(path, { account });

		await userEvent.type(
			await screen.findByRole("textbox", { name: /Sequence [0-9]/ }),
			"q",
		);
		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		expect(
			screen.getByText(
				"Sequence should only contain the characters: ATCGNRYKM",
			),
		).toBeInTheDocument();
	});

	it("should clear form cache submitting", async () => {
		const scope = mockApiEditSequence(
			otu.id,
			otu.isolates[0].id,
			activeSequence.id,
			"user_typed_accession",
			"user_typed_definition",
			"user_typed_host",
			"ACGRYKM",
			null,
		);
		const account = createFakeAccount({ administrator_role: "full" });
		await renderRoute(path, { account });

		await userEvent.click(await screen.findByRole("combobox"));
		await userEvent.click(screen.getByRole("option", { name: "None" }));
		await userEvent.clear(
			screen.getByRole("textbox", { name: "Accession (ID)" }),
		);
		await userEvent.type(
			screen.getByRole("textbox", { name: "Accession (ID)" }),
			"user_typed_accession",
		);
		await userEvent.clear(screen.getByRole("textbox", { name: "Host" }));
		await userEvent.type(
			screen.getByRole("textbox", { name: "Host" }),
			"user_typed_host",
		);
		await userEvent.clear(screen.getByRole("textbox", { name: "Definition" }));
		await userEvent.type(
			screen.getByRole("textbox", { name: "Definition" }),
			"user_typed_definition",
		);
		await userEvent.clear(
			screen.getByRole("textbox", { name: /Sequence [0-9]/ }),
		);
		await userEvent.type(
			screen.getByRole("textbox", { name: /Sequence [0-9]/ }),
			"ACGRYKM",
		);

		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		scope.done();

		window.sessionStorage.clear();
		nock.cleanAll();
		mockApiGetReferenceDetail(reference);
		mockApiGetOtu(otu);

		await renderRoute(path, { account });
		expect(screen.queryByText("Resumed editing draft sequence.")).toBeNull();
	});
});
