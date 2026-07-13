import { formatPath } from "@app/hooks";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import {
	createFakeFile,
	mockApiDeleteFile,
	mockApiListFiles,
} from "@tests/fake/files";
import { renderWithRouter } from "@tests/setup";
import { upload } from "@uploads/uploader";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FileManager, type FileManagerProps } from "../FileManager";

describe("<FileManager>", () => {
	let props: FileManagerProps;
	let path: string;

	afterEach(() => {
		vi.restoreAllMocks();
	});

	beforeEach(() => {
		props = {
			accept: {
				"application/gzip": [".fasta.gz", ".fa.gz", ".fastq.gz", ".fq.gz"],
			},
			fileType: "reads",
			message: "",
		};
		path = formatPath("/samples/uploads", { page: 1 });
	});

	it("should upload with validation based on passed regex", async () => {
		mockApiGetAccount(
			createFakeAccount({
				administrator_role: null,
				permissions: {
					cancel_job: false,
					create_ref: false,
					create_sample: false,
					modify_hmm: false,
					modify_subtraction: false,
					remove_file: false,
					remove_job: false,
					upload_file: true,
				},
			}),
		);
		mockApiListFiles([createFakeFile({ name: "subtraction.fq.gz" })], true);

		vi.mock("@uploads/uploader");

		await renderWithRouter(
			<FileManager {...props} regex={/.(?:fa|fasta)(?:.gz|.gzip)?$/} />,
			path,
		);

		expect(
			await screen.findByText("Drag file here to upload"),
		).toBeInTheDocument();
		expect(screen.getByText("subtraction.fq.gz")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Browse Files" }),
		).toBeInTheDocument();

		const invalidFile = new File(["test"], "test_invalid_file.gz", {
			type: "application/gzip",
		});
		const validFile = new File(["test"], "test_valid_file.fa.gz", {
			type: "application/gzip",
		});

		await userEvent.upload(await screen.findByLabelText("Upload file"), [
			invalidFile,
			validFile,
		]);

		await waitFor(() => {
			expect(upload).toHaveBeenCalledTimes(1);
			expect(upload).toHaveBeenCalledWith(validFile, props.fileType);
		});
	});

	it("should hide upload bar if user lacks permission", async () => {
		mockApiGetAccount(createFakeAccount({ administrator_role: null }));
		mockApiListFiles([createFakeFile({ name: "subtraction.fq.gz" })], true);

		await renderWithRouter(<FileManager {...props} />, path);

		expect(
			await screen.findByText("You do not have permission to upload files."),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "Upload" }),
		).not.toBeInTheDocument();
	});

	it("should take custom message", async () => {
		mockApiGetAccount(
			createFakeAccount({
				administrator_role: "full",
			}),
		);
		mockApiListFiles([createFakeFile({ name: "subtraction.fq.gz" })], true);

		await renderWithRouter(
			<FileManager {...props} message="Test Message" />,
			path,
		);

		expect(await screen.findByText("Test Message")).toBeInTheDocument();
	});

	describe("selection", () => {
		it("should delete every selected file", async () => {
			const first = createFakeFile({ name: "one.fq.gz" });
			const second = createFakeFile({ name: "two.fq.gz" });
			const unselected = createFakeFile({ name: "three.fq.gz" });
			const files = [first, second, unselected];

			mockApiGetAccount(createFakeAccount({ administrator_role: "full" }));
			mockApiListFiles(files, true);
			mockApiListFiles(files, true);

			const firstScope = mockApiDeleteFile(first.id);
			const secondScope = mockApiDeleteFile(second.id);
			const unselectedScope = mockApiDeleteFile(unselected.id);

			await renderWithRouter(<FileManager {...props} />, path);

			expect(await screen.findByText("3 files")).toBeInTheDocument();

			await userEvent.click(
				screen.getByRole("checkbox", { name: "Select one.fq.gz" }),
			);
			await userEvent.click(
				screen.getByRole("checkbox", { name: "Select two.fq.gz" }),
			);

			expect(screen.getByText("2 selected")).toBeInTheDocument();

			await userEvent.click(screen.getByRole("button", { name: "Delete" }));

			await waitFor(() => {
				expect(firstScope.isDone()).toBe(true);
				expect(secondScope.isDone()).toBe(true);
			});

			expect(unselectedScope.isDone()).toBe(false);
		});

		it("should select and deselect every file on the page", async () => {
			const files = [
				createFakeFile({ name: "one.fq.gz" }),
				createFakeFile({ name: "two.fq.gz" }),
			];

			mockApiGetAccount(createFakeAccount({ administrator_role: "full" }));
			mockApiListFiles(files, true);

			await renderWithRouter(<FileManager {...props} />, path);

			const selectAll = await screen.findByRole("checkbox", {
				name: "Select all files",
			});

			await userEvent.click(selectAll);
			expect(screen.getByText("2 selected")).toBeInTheDocument();

			await userEvent.click(selectAll);
			expect(screen.getByText("2 files")).toBeInTheDocument();
			expect(
				screen.queryByRole("button", { name: "Delete" }),
			).not.toBeInTheDocument();
		});

		it("should hide checkboxes when there is nothing to do with a selection", async () => {
			mockApiGetAccount(createFakeAccount({ administrator_role: null }));
			mockApiListFiles([createFakeFile({ name: "one.fq.gz" })], true);

			await renderWithRouter(<FileManager {...props} />, path);

			expect(await screen.findByText("one.fq.gz")).toBeInTheDocument();
			expect(
				screen.queryByRole("checkbox", { name: "Select all files" }),
			).not.toBeInTheDocument();
			expect(
				screen.queryByRole("checkbox", { name: "Select one.fq.gz" }),
			).not.toBeInTheDocument();
		});
	});

	describe("selection action", () => {
		const first = createFakeFile({ name: "one.fq.gz" });
		const second = createFakeFile({ name: "two.fq.gz" });

		// Stands in for the create-samples action: it names the files it was given
		// and hands them back as consumed when clicked.
		function renderWithSelectionAction() {
			return renderWithRouter(
				<FileManager
					{...props}
					renderSelectionAction={(selected, deselect) => (
						<button type="button" onClick={() => deselect(selected)}>
							{`Consume ${selected.length}`}
						</button>
					)}
				/>,
				path,
			);
		}

		it("should show the action once files are selected, given the selection", async () => {
			mockApiGetAccount(createFakeAccount({ administrator_role: "full" }));
			mockApiListFiles([first, second], true);

			await renderWithSelectionAction();

			expect(await screen.findByText("2 files")).toBeInTheDocument();
			expect(
				screen.queryByRole("button", { name: /Consume/ }),
			).not.toBeInTheDocument();

			await userEvent.click(
				screen.getByRole("checkbox", { name: "Select one.fq.gz" }),
			);

			expect(
				screen.getByRole("button", { name: "Consume 1" }),
			).toBeInTheDocument();
		});

		it("should make files selectable without permission to delete them", async () => {
			mockApiGetAccount(
				createFakeAccount({
					administrator_role: null,
					permissions: {
						...createFakeAccount().permissions,
						create_sample: true,
						remove_file: false,
					},
				}),
			);
			mockApiListFiles([first], true);

			await renderWithSelectionAction();

			await userEvent.click(
				await screen.findByRole("checkbox", { name: "Select one.fq.gz" }),
			);

			expect(
				screen.getByRole("button", { name: "Consume 1" }),
			).toBeInTheDocument();
			expect(
				screen.queryByRole("button", { name: "Delete" }),
			).not.toBeInTheDocument();
		});

		it("should drop the files the action consumed, leaving the rest selected", async () => {
			mockApiGetAccount(createFakeAccount({ administrator_role: "full" }));
			mockApiListFiles([first, second], true);

			await renderWithSelectionAction();

			await userEvent.click(
				await screen.findByRole("checkbox", { name: "Select one.fq.gz" }),
			);
			await userEvent.click(
				screen.getByRole("checkbox", { name: "Select two.fq.gz" }),
			);

			expect(screen.getByText("2 selected")).toBeInTheDocument();

			await userEvent.click(screen.getByRole("button", { name: "Consume 2" }));

			expect(screen.getByText("2 files")).toBeInTheDocument();
			expect(
				screen.getByRole("checkbox", { name: "Select one.fq.gz" }),
			).not.toBeChecked();
		});
	});
});
