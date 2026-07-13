import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiListGroups } from "@tests/api/groups";
import { mockApiGetLabels } from "@tests/api/labels";
import { mockApiGetUploads } from "@tests/api/uploads";
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
import { renderRoute } from "@tests/setup";
import type { Upload } from "@uploads/types";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("/samples/create", () => {
	const label = createFakeLabel();
	const subtractionShortlist = createFakeShortlistSubtraction();

	beforeEach(() => {
		mockApiGetAccount(createFakeAccount({ primary_group: null }));
		mockApiListGroups([]);
		mockApiGetLabels([label]);
		mockApiGetShortlistSubtractions([subtractionShortlist]);
	});

	afterEach(() => nock.cleanAll());

	/** Renders the route with the given uploads available and named in the URL. */
	function renderCreate(available: Upload[], ids?: number[]) {
		mockApiGetUploads(available);

		const search = (ids ?? available.map((upload) => upload.id))
			.map((id) => `upload=${id}`)
			.join("&");

		return renderRoute(`/samples/create?${search}`);
	}

	function findSaveButton(count: number) {
		return screen.findByRole("button", {
			name: count === 1 ? "Create Sample" : `Create ${count} Samples`,
		});
	}

	it("should create one sample per read file, named after it", async () => {
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

		await renderCreate([first, second]);

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

		// Named R2-first in the URL, to prove the reads are sent [LEFT, RIGHT].
		await renderCreate([right, left]);

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

		await renderCreate([first, second]);

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

	it("should collect metadata for a sample when the fields are shown", async () => {
		const file = createFakeFile({ name: "sample_one.fastq.gz" });

		const scope = mockApiCreateSample(
			"sample_one",
			"Clone AB",
			"Apple",
			"Earth",
			"normal",
			[file.id],
			[],
			[],
			null,
		);

		await renderCreate([file]);

		await userEvent.click(
			await screen.findByRole("switch", { name: "Metadata Fields" }),
		);

		await userEvent.type(
			screen.getByRole("textbox", { name: "Isolate for sample_one.fastq.gz" }),
			"Clone AB",
		);
		await userEvent.type(
			screen.getByRole("textbox", { name: "Host for sample_one.fastq.gz" }),
			"Apple",
		);
		await userEvent.type(
			screen.getByRole("textbox", { name: "Locale for sample_one.fastq.gz" }),
			"Earth",
		);

		await userEvent.click(await findSaveButton(1));

		scope.done();
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

		await renderCreate([first, second]);

		await userEvent.click(await screen.findByText("sRNA"));
		await userEvent.click(await findSaveButton(2));

		for (const scope of scopes) {
			scope.done();
		}
	});

	it("should require a name for every sample", async () => {
		const file = createFakeFile({ name: "sample_one.fastq.gz" });

		await renderCreate([file]);

		await userEvent.clear(
			await screen.findByRole("textbox", {
				name: "Name for sample_one.fastq.gz",
			}),
		);
		await userEvent.click(await findSaveButton(1));

		// Nothing is requested: nock would throw on an unmocked POST.
		expect(await screen.findByText("Required Field")).toBeInTheDocument();
	});

	it("should keep a rejected sample, with its reason, and drop the created one", async () => {
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
			mockApiCreateSampleFailure("sample_two", "Name already in use"),
		];

		await renderCreate([first, second]);

		await userEvent.click(await findSaveButton(2));

		expect(await screen.findByText("Name already in use")).toBeInTheDocument();

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

	describe("when a named read file is gone", () => {
		it("should warn, and create samples from the ones that remain", async () => {
			const file = createFakeFile({ name: "sample_one.fastq.gz" });
			const removed = createFakeFile({ name: "sample_two.fastq.gz" });

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

			// The URL names both, but only one is still available.
			await renderCreate([file], [file.id, removed.id]);

			expect(
				await screen.findByText(/1 selected read file is no longer available/),
			).toBeInTheDocument();
			expect(
				screen.queryByRole("textbox", {
					name: "Name for sample_two.fastq.gz",
				}),
			).not.toBeInTheDocument();

			await userEvent.click(await findSaveButton(1));

			scope.done();
		});

		it("should show an empty state when none remain", async () => {
			const removed = createFakeFile({ name: "sample_one.fastq.gz" });

			await renderCreate([], [removed.id]);

			expect(
				await screen.findByText("No read files selected"),
			).toBeInTheDocument();
			expect(
				screen.getByRole("link", { name: "Browse Read Files" }),
			).toBeInTheDocument();
		});
	});

	it("should show an empty state when no read files are named", async () => {
		mockApiGetUploads([]);

		await renderRoute("/samples/create");

		expect(
			await screen.findByText("No read files selected"),
		).toBeInTheDocument();
	});
});
