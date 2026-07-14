import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiListFiles } from "@tests/api/files";
import { mockApiCreateSample } from "@tests/api/samples";
import { mockApiGetShortlistSubtractions } from "@tests/api/subtractions";
import { createFakeAccount } from "@tests/fake/account";
import { createFakeFile } from "@tests/fake/files";
import { createFakeLabel } from "@tests/fake/labels";
import { createFakeShortlistSubtraction } from "@tests/fake/subtractions";
import { mockListGroups } from "@tests/server-fn/groups";
import { mockGetAccount } from "@tests/server-fn/users";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import CreateSample from "../CreateSample";

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** The read-list button whose accessible name contains `name`. */
function readRowButton(name: string): HTMLElement {
	return screen.getByRole("button", { name: new RegExp(escapeRegExp(name)) });
}

async function setReadSelectorMode(
	name: "Auto-pair" | "Manual",
): Promise<void> {
	await userEvent.click(
		screen.getByRole("button", { name: /^(Auto-pair|Manual)$/ }),
	);
	await userEvent.click(
		await screen.findByRole("menuitem", { name: new RegExp(name) }),
	);
}

describe("<CreateSample>", () => {
	const firstLabel = createFakeLabel();
	const labels = [firstLabel];
	const subtractionShortlist = createFakeShortlistSubtraction();

	beforeEach(() => {
		window.sessionStorage.clear();

		mockGetAccount(createFakeAccount({ primary_group: null }));
		mockListGroups([]);
	});

	afterEach(() => nock.cleanAll());

	/**
	 * Renders the page and waits for its fields to replace the loading state.
	 * Save sits in the header, so it is present while the page is still loading.
	 */
	async function renderPage() {
		await renderWithRouter(<CreateSample labels={labels} />);
		await screen.findByLabelText("Name");
	}

	async function submitForm() {
		await userEvent.click(screen.getByRole("button", { name: "Save" }));
	}

	it("should show loader when there are no subtractions", async () => {
		const file = createFakeFile();
		const filesScope = mockApiListFiles([file]);

		await renderWithRouter(<CreateSample labels={labels} />);
		expect(await screen.findByLabelText("loading")).toBeInTheDocument();

		filesScope.done();
	});

	it("should show loader when there are no sample uploads to read", async () => {
		await renderWithRouter(<CreateSample labels={labels} />);
		expect(await screen.findByLabelText("loading")).toBeInTheDocument();
	});

	it("should fail and show errors on empty submission", async () => {
		const file = createFakeFile();

		mockApiListFiles([file]);
		mockApiGetShortlistSubtractions([]);

		await renderPage();

		expect(await screen.findByText("Create Sample")).toBeInTheDocument();
		expect(screen.queryByText("Required Field")).not.toBeInTheDocument();
		expect(
			screen.queryByText(
				"At least one read file must be attached to the sample",
			),
		).not.toBeInTheDocument();

		await submitForm();

		expect(screen.getByText("Required Field")).toBeInTheDocument();
		expect(
			screen.getByText("At least one read file must be attached to the sample"),
		).toBeInTheDocument();
	});

	it("should submit when minimum fields are completed", async () => {
		const file = createFakeFile();

		mockApiListFiles([file]);
		mockApiGetShortlistSubtractions([]);

		const scope = mockApiCreateSample(
			"Sample A",
			"",
			"",
			"",
			"normal",
			[file.id],
			[],
			[],
			null,
		);

		await renderPage();

		// Wait for the data to load.
		expect(await screen.findByText("Create Sample")).toBeInTheDocument();
		await userEvent.click(screen.getByRole("button", { name: "Reset" }));

		await userEvent.type(await screen.findByLabelText("Name"), "Sample A");
		await userEvent.click(screen.getByText(file.name));

		await submitForm();

		scope.done();
	});

	it("should submit when all form fields complete", async () => {
		const firstFile = createFakeFile();
		const secondFile = createFakeFile();
		const files = [firstFile, secondFile];

		mockApiListFiles(files);
		mockApiGetShortlistSubtractions([subtractionShortlist]);

		const scope = mockApiCreateSample(
			"Sample T",
			"Clone AB",
			"Apple",
			"Earth",
			"normal",
			[firstFile.id, secondFile.id],
			[firstLabel.id],
			[subtractionShortlist.id],
			null,
		);

		await renderPage();

		// Wait for the data to load.
		expect(await screen.findByText("Create Sample")).toBeInTheDocument();

		// Fill out main form.
		await userEvent.type(screen.getByLabelText("Name"), "Sample T");

		// Reveal the hidden metadata fields.
		await userEvent.click(
			screen.getByRole("button", { name: "Show Metadata Fields" }),
		);
		await userEvent.type(await screen.findByLabelText("Isolate"), "Clone AB");
		await userEvent.type(screen.getByLabelText("Host"), "Apple");
		await userEvent.type(screen.getByLabelText("Locale"), "Earth");
		await userEvent.click(screen.getByText("Normal"));

		// Select Files
		await setReadSelectorMode("Manual");
		await userEvent.click(screen.getByText(firstFile.name));
		await userEvent.click(screen.getByText(secondFile.name));

		// Select Labels
		await userEvent.click(
			screen.getByRole("button", { name: "Toggle Labels menu" }),
		);
		await userEvent.click(
			screen.getByRole("option", { name: firstLabel.name }),
		);

		// Select Subtractions
		await userEvent.click(
			screen.getByRole("button", { name: "Toggle Default Subtractions menu" }),
		);
		await userEvent.click(
			screen.getByRole("option", { name: subtractionShortlist.name }),
		);

		// Submit.
		await submitForm();

		scope.done();
	});

	it("should show and hide the metadata fields", async () => {
		const file = createFakeFile();

		mockApiListFiles([file]);
		mockApiGetShortlistSubtractions([]);

		await renderPage();

		expect(await screen.findByText("Create Sample")).toBeInTheDocument();

		// Hidden by default.
		expect(screen.queryByLabelText("Isolate")).not.toBeInTheDocument();
		expect(screen.queryByLabelText("Host")).not.toBeInTheDocument();
		expect(screen.queryByLabelText("Locale")).not.toBeInTheDocument();

		const toggle = screen.getByRole("button", { name: "Show Metadata Fields" });

		// Visible after turning the switch on.
		await userEvent.click(toggle);
		expect(screen.getByLabelText("Isolate")).toBeInTheDocument();
		expect(screen.getByLabelText("Host")).toBeInTheDocument();
		expect(screen.getByLabelText("Locale")).toBeInTheDocument();

		// Hidden again after turning the switch off.
		await userEvent.click(toggle);
		expect(screen.queryByLabelText("Isolate")).not.toBeInTheDocument();
		expect(screen.queryByLabelText("Host")).not.toBeInTheDocument();
		expect(screen.queryByLabelText("Locale")).not.toBeInTheDocument();
	});

	it("should be able to autofill the sample name", async () => {
		const file = createFakeFile({ name: "14T81.fq.gz" });

		mockApiListFiles([file]);
		mockApiGetShortlistSubtractions([{ name: "foo", ready: true, id: "test" }]);

		await renderPage();

		const field = await screen.findByRole("textbox", { name: "Name" });
		expect(field).toHaveValue("");

		await userEvent.click(screen.getByText(file.name));
		await userEvent.click(screen.getByRole("button", { name: "Auto Fill" }));

		expect(field).toHaveValue("14T81");
	});

	it("should autofill the sample name from a fastq.gz filename", async () => {
		const file = createFakeFile({ name: "sample_one.fastq.gz" });

		mockApiListFiles([file]);
		mockApiGetShortlistSubtractions([{ name: "foo", ready: true, id: "test" }]);

		await renderPage();

		const field = await screen.findByRole("textbox", { name: "Name" });
		expect(field).toHaveValue("");

		await userEvent.click(screen.getByText(file.name));
		await userEvent.click(screen.getByRole("button", { name: "Auto Fill" }));

		expect(field).toHaveValue("sample_one");
	});

	it.each([
		["sample_one.fq", "sample_one"],
		["sample_one.fastq", "sample_one"],
		["sample_one.fa", "sample_one"],
		["sample_one.fasta", "sample_one"],
		["sample_one.FASTQ.GZ", "sample_one"],
	])("should autofill the sample name from %s", async (fileName, expected) => {
		const file = createFakeFile({ name: fileName });

		mockApiListFiles([file]);
		mockApiGetShortlistSubtractions([{ name: "foo", ready: true, id: "test" }]);

		await renderPage();

		const field = await screen.findByRole("textbox", { name: "Name" });
		expect(field).toHaveValue("");

		await userEvent.click(screen.getByText(file.name));
		await userEvent.click(screen.getByRole("button", { name: "Auto Fill" }));

		expect(field).toHaveValue(expected);
	});

	it("should not autofill the sample name when the extension is invalid", async () => {
		const file = createFakeFile({ name: "sample_one.fqst" });

		mockApiListFiles([file]);
		mockApiGetShortlistSubtractions([{ name: "foo", ready: true, id: "test" }]);

		await renderPage();

		const field = await screen.findByRole("textbox", { name: "Name" });
		expect(field).toHaveValue("");

		await userEvent.click(screen.getByText(file.name));
		await userEvent.click(screen.getByRole("button", { name: "Auto Fill" }));

		expect(field).toHaveValue("");
	});

	it("should clear selections when reset button is clicked", async () => {
		const file = createFakeFile({ name: "large.fastq.gz" });

		mockApiListFiles([file]);
		mockApiGetShortlistSubtractions([]);

		await renderPage();

		expect(await screen.findByText("Create Sample")).toBeInTheDocument();

		await userEvent.click(screen.getByText(file.name));
		expect(screen.getByText("Unpaired")).toBeInTheDocument();

		await userEvent.click(screen.getByRole("button", { name: "Reset" }));
		expect(screen.queryByText("Unpaired")).not.toBeInTheDocument();
	});

	it("should be able to swap read orientation", async () => {
		const firstFile = createFakeFile({ name: "alpha.fastq.gz" });
		const secondFile = createFakeFile({ name: "beta.fastq.gz" });
		const files = [firstFile, secondFile];

		mockApiListFiles(files);
		mockApiGetShortlistSubtractions([]);

		await renderPage();

		expect(await screen.findByText("Create Sample")).toBeInTheDocument();

		await setReadSelectorMode("Manual");
		await userEvent.click(screen.getByText(firstFile.name));
		await userEvent.click(screen.getByText(secondFile.name));

		expect(screen.getByText("Paired")).toBeInTheDocument();
		expect(
			within(readRowButton(firstFile.name)).getByText("LEFT"),
		).toBeVisible();

		await userEvent.click(screen.getByRole("button", { name: /swap reads/i }));

		expect(
			within(readRowButton(firstFile.name)).getByText("RIGHT"),
		).toBeVisible();
	});

	it("should show correct read orientations", async () => {
		const firstFile = createFakeFile({ name: "alpha.fastq.gz" });
		const secondFile = createFakeFile({ name: "beta.fastq.gz" });
		const files = [firstFile, secondFile];

		mockApiListFiles(files);
		mockApiGetShortlistSubtractions([{ name: "foo", ready: true, id: "test" }]);

		await renderPage();

		await userEvent.type(await screen.findByLabelText("Name"), "Sample B");

		await setReadSelectorMode("Manual");
		await userEvent.click(screen.getByText(firstFile.name));

		expect(
			within(readRowButton(firstFile.name)).getByText("LEFT"),
		).toBeVisible();
		expect(screen.getByText(/Unpaired/)).toBeInTheDocument();

		await userEvent.click(screen.getByText(secondFile.name));

		expect(
			within(readRowButton(secondFile.name)).getByText("RIGHT"),
		).toBeVisible();
		expect(screen.getByText(/Paired/)).toBeInTheDocument();
	});

	it("should render correct read orientations with 1 file selected", async () => {
		const file = createFakeFile({ name: "large.fastq.gz" });
		mockApiListFiles([file]);
		mockApiGetShortlistSubtractions([]);
		await renderPage();

		expect(await screen.findByText("Create Sample")).toBeInTheDocument();

		await userEvent.click(screen.getByText(file.name));

		expect(within(readRowButton(file.name)).getByText("LEFT")).toBeVisible();
		expect(within(readRowButton(file.name)).queryByText("RIGHT")).toBeNull();
		expect(screen.getByText(/Unpaired/)).toBeInTheDocument();
	});
});
