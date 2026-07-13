import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiListGroups } from "@tests/api/groups";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakeFile } from "@tests/fake/files";
import { createFakeLabel } from "@tests/fake/labels";
import {
	mockApiCreateSample,
	mockApiCreateSampleFailure,
} from "@tests/fake/samples";
import {
	createFakeShortlistSubtraction,
	mockApiGetShortlistSubtractions,
} from "@tests/fake/subtractions";
import { renderWithRouter } from "@tests/setup";
import type { Upload } from "@uploads/types";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CreateSamples from "../CreateSamples";

describe("<CreateSamples>", () => {
	const label = createFakeLabel();
	const subtractionShortlist = createFakeShortlistSubtraction();

	const onCreated = vi.fn();

	beforeEach(() => {
		onCreated.mockClear();
		mockApiGetAccount(createFakeAccount({ primary_group: null }));
		mockApiListGroups([]);
		mockApiGetShortlistSubtractions([subtractionShortlist]);
	});

	afterEach(() => nock.cleanAll());

	async function renderDialog(uploads: Upload[]) {
		await renderWithRouter(
			<CreateSamples
				labels={[label]}
				onCreated={onCreated}
				uploads={uploads}
			/>,
		);

		await userEvent.click(
			screen.getByRole("button", { name: "Create Samples" }),
		);
	}

	/** Waits for the form's queries to settle, then finds its submit button. */
	function findSaveButton(count: number) {
		return screen.findByRole("button", {
			name: count === 1 ? "Create Sample" : `Create ${count} Samples`,
		});
	}

	it("should create one sample per selected file, named after it", async () => {
		const first = createFakeFile({ name: "sample_one.fastq.gz" });
		const second = createFakeFile({ name: "sample_two.fastq.gz" });

		const scopes = [
			mockApiCreateSample(
				"sample_one",
				"",
				"",
				"",
				"normal",
				[first.id],
				[],
				[],
				null,
			),
			mockApiCreateSample(
				"sample_two",
				"",
				"",
				"",
				"normal",
				[second.id],
				[],
				[],
				null,
			),
		];

		await renderDialog([first, second]);

		expect(
			await screen.findByRole("textbox", {
				name: "Name for sample_one.fastq.gz",
			}),
		).toHaveValue("sample_one");
		expect(
			screen.getByRole("textbox", { name: "Name for sample_two.fastq.gz" }),
		).toHaveValue("sample_two");

		await userEvent.click(await findSaveButton(2));

		for (const scope of scopes) {
			scope.done();
		}
	});

	it("should group a mate pair into a single paired sample", async () => {
		const left = createFakeFile({ name: "sample_one_R1.fastq.gz" });
		const right = createFakeFile({ name: "sample_one_R2.fastq.gz" });

		const scope = mockApiCreateSample(
			"sample_one",
			"",
			"",
			"",
			"normal",
			[left.id, right.id],
			[],
			[],
			null,
		);

		// Given R2 first, to prove the reads are sent in [LEFT, RIGHT] order.
		await renderDialog([right, left]);

		expect(
			await screen.findByRole("textbox", {
				name: "Name for sample_one_R1.fastq.gz",
			}),
		).toHaveValue("sample_one");
		expect(screen.getByText("sample_one_R1.fastq.gz")).toBeInTheDocument();
		expect(screen.getByText("sample_one_R2.fastq.gz")).toBeInTheDocument();
		expect(screen.getByText("Paired")).toBeInTheDocument();

		await userEvent.click(await findSaveButton(1));

		scope.done();
	});

	it("should submit each sample with its own name, labels, and subtractions", async () => {
		const first = createFakeFile({ name: "sample_one.fastq.gz" });
		const second = createFakeFile({ name: "sample_two.fastq.gz" });

		const scopes = [
			mockApiCreateSample(
				"Sample A",
				"",
				"",
				"",
				"normal",
				[first.id],
				[label.id],
				[subtractionShortlist.id],
				null,
			),
			mockApiCreateSample(
				"sample_two",
				"",
				"",
				"",
				"normal",
				[second.id],
				[],
				[],
				null,
			),
		];

		await renderDialog([first, second]);

		const field = await screen.findByRole("textbox", {
			name: "Name for sample_one.fastq.gz",
		});
		await userEvent.clear(field);
		await userEvent.type(field, "Sample A");

		await userEvent.click(
			screen.getByRole("button", {
				name: "Toggle Labels for sample_one.fastq.gz menu",
			}),
		);
		await userEvent.click(screen.getByRole("option", { name: label.name }));

		await userEvent.click(
			screen.getByRole("button", {
				name: "Toggle Subtractions for sample_one.fastq.gz menu",
			}),
		);
		await userEvent.click(
			screen.getByRole("option", { name: subtractionShortlist.name }),
		);

		await userEvent.click(await findSaveButton(2));

		for (const scope of scopes) {
			scope.done();
		}
	});

	it("should apply the library type to every sample in the batch", async () => {
		const first = createFakeFile({ name: "sample_one.fastq.gz" });
		const second = createFakeFile({ name: "sample_two.fastq.gz" });

		const scopes = [
			mockApiCreateSample(
				"sample_one",
				"",
				"",
				"",
				"srna",
				[first.id],
				[],
				[],
				null,
			),
			mockApiCreateSample(
				"sample_two",
				"",
				"",
				"",
				"srna",
				[second.id],
				[],
				[],
				null,
			),
		];

		await renderDialog([first, second]);

		await userEvent.click(await screen.findByText("sRNA"));
		await userEvent.click(await findSaveButton(2));

		for (const scope of scopes) {
			scope.done();
		}
	});

	it("should require a name for every sample", async () => {
		const file = createFakeFile({ name: "sample_one.fastq.gz" });

		await renderDialog([file]);

		const field = await screen.findByRole("textbox", {
			name: "Name for sample_one.fastq.gz",
		});
		await userEvent.clear(field);

		await userEvent.click(await findSaveButton(1));

		expect(await screen.findByText("Required Field")).toBeInTheDocument();
		// Nothing was requested: nock would throw on an unmocked POST.
	});

	describe("when the API rejects one of the samples", () => {
		const first = createFakeFile({ name: "sample_one.fastq.gz" });
		const second = createFakeFile({ name: "sample_two.fastq.gz" });

		function mockPartialFailure() {
			return [
				mockApiCreateSample(
					"sample_one",
					"",
					"",
					"",
					"normal",
					[first.id],
					[],
					[],
					null,
				),
				mockApiCreateSampleFailure("sample_two", "Name already in use"),
			];
		}

		it("should keep the rejected sample, with its reason, and drop the created one", async () => {
			const scopes = mockPartialFailure();

			await renderDialog([first, second]);

			await userEvent.click(await findSaveButton(2));

			expect(
				await screen.findByText("Name already in use"),
			).toBeInTheDocument();

			// The created sample's row is gone; the rejected one remains to be fixed.
			expect(
				screen.queryByRole("textbox", { name: "Name for sample_one.fastq.gz" }),
			).not.toBeInTheDocument();
			expect(
				screen.getByRole("textbox", { name: "Name for sample_two.fastq.gz" }),
			).toBeInTheDocument();
			expect(await findSaveButton(1)).toBeInTheDocument();

			for (const scope of scopes) {
				scope.done();
			}
		});

		it("should deselect only the files of the samples that were created", async () => {
			const scopes = mockPartialFailure();

			await renderDialog([first, second]);

			await userEvent.click(await findSaveButton(2));

			await screen.findByText("Name already in use");

			expect(onCreated).toHaveBeenCalledWith([first]);

			for (const scope of scopes) {
				scope.done();
			}
		});
	});

	it("should deselect every file and close once all the samples are created", async () => {
		const file = createFakeFile({ name: "sample_one.fastq.gz" });

		const scope = mockApiCreateSample(
			"sample_one",
			"",
			"",
			"",
			"normal",
			[file.id],
			[],
			[],
			null,
		);

		await renderDialog([file]);

		await userEvent.click(await findSaveButton(1));

		await waitForDialogToClose();

		expect(onCreated).toHaveBeenCalledWith([file]);

		scope.done();
	});

	async function waitForDialogToClose() {
		await screen.findByRole("button", { name: "Create Samples" });
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	}
});
