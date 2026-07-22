import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiCreateReference } from "@tests/api/references";
import { renderWithRouter } from "@tests/setup";
import type { Upload } from "@uploads/types";
import { postUpload } from "@uploads/uploader";
import nock from "nock";
import { describe, expect, it, vi } from "vitest";
import { CreateReferenceForm } from "../CreateReferenceForm";

// The reference upload posts through `postUpload` (an XHR wrapper), not the
// generated server-function client, so stub it directly rather than mocking the
// network. Its resolved value drives the imported upload's id and name.
vi.mock("@uploads/uploader", async (importOriginal) => ({
	...(await importOriginal<typeof import("@uploads/uploader")>()),
	postUpload: vi.fn(),
}));

function mockUpload(upload: Partial<Upload>): void {
	vi.mocked(postUpload).mockResolvedValue(upload as Upload);
}

describe("<CreateReferenceForm />", () => {
	describe("mode='empty'", () => {
		it("should display error and block submission when name is empty", async () => {
			await renderWithRouter(
				<CreateReferenceForm mode="empty" onSuccess={() => {}} />,
			);

			await userEvent.click(screen.getByRole("button", { name: "Create" }));

			expect(screen.getByText("Required Field")).toBeInTheDocument();
		});

		it("should submit and call onSuccess when name is provided", async () => {
			const scope = mockApiCreateReference("Test Reference", "", "");

			let succeeded = false;
			await renderWithRouter(
				<CreateReferenceForm
					mode="empty"
					onSuccess={() => {
						succeeded = true;
					}}
				/>,
			);

			await userEvent.type(
				screen.getByRole("textbox", { name: "Name" }),
				"Test Reference",
			);
			await userEvent.click(screen.getByRole("button", { name: "Create" }));

			await screen.findByRole("button", { name: "Create" });
			expect(succeeded).toBe(true);
			scope.done();
		});
	});

	describe("mode='import'", () => {
		it("should upload file and import reference", async () => {
			mockUpload({ id: 12, name: "external.json.gz" });

			const scope = nock("http://localhost")
				.post("/api/refs", {
					name: "External",
					description: "External reference",
					import_from: 12,
				})
				.reply(201, {
					id: "foo",
					name: "External",
					description: "External reference",
				});

			await renderWithRouter(
				<CreateReferenceForm mode="import" onSuccess={() => {}} />,
			);

			await userEvent.upload(
				screen.getByLabelText("Upload file"),
				new File(['{"test": true}'], "external.json.gz", {
					type: "application/gzip",
				}),
			);
			await waitFor(() => expect(postUpload).toHaveBeenCalledTimes(1));

			await userEvent.type(
				screen.getByRole("textbox", { name: "Name" }),
				"External",
			);
			await userEvent.type(
				screen.getByRole("textbox", { name: "Description" }),
				"External reference",
			);
			await userEvent.click(screen.getByRole("button", { name: "Create" }));

			await waitFor(() => expect(scope.isDone()).toBeTruthy());
		});

		it("should surface an error when submitted before the upload finishes", async () => {
			// A never-settling upload leaves the imported id unset.
			vi.mocked(postUpload).mockReturnValue(new Promise(() => {}));

			await renderWithRouter(
				<CreateReferenceForm mode="import" onSuccess={() => {}} />,
			);

			await userEvent.upload(
				screen.getByLabelText("Upload file"),
				new File(['{"test": true}'], "external.json.gz", {
					type: "application/gzip",
				}),
			);
			await userEvent.type(
				screen.getByRole("textbox", { name: "Name" }),
				"External",
			);
			await userEvent.click(screen.getByRole("button", { name: "Create" }));

			expect(
				screen.getByText("Please wait for the upload to finish"),
			).toBeInTheDocument();
		});

		it("should display errors when file or name missing", async () => {
			await renderWithRouter(
				<CreateReferenceForm mode="import" onSuccess={() => {}} />,
			);

			expect(
				screen.queryByText("A reference file must be uploaded"),
			).not.toBeInTheDocument();
			expect(screen.queryByText("Required Field")).not.toBeInTheDocument();

			await userEvent.click(screen.getByRole("button", { name: "Create" }));

			expect(
				screen.getByText("A reference file must be uploaded"),
			).toBeInTheDocument();
			expect(screen.getByText("Required Field")).toBeInTheDocument();
		});
	});
});
