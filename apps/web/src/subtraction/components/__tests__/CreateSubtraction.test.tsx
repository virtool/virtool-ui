import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeFile } from "@tests/fake/files";
import { createFakeSubtraction } from "@tests/fake/subtractions";
import { mockCreateSubtraction } from "@tests/server-fn/subtractions";
import { mockFindUploads } from "@tests/server-fn/uploads";
import { renderWithRouter } from "@tests/setup";
import { describe, expect, it } from "vitest";
import SubtractionCreate from "../SubtractionCreate";

async function openDialog() {
	await renderWithRouter(<SubtractionCreate />);
	await userEvent.click(screen.getByRole("button", { name: "Create" }));
}

describe("<SubtractionCreate />", () => {
	it("should render when no uploads available", async () => {
		mockFindUploads([]);
		await openDialog();

		expect(await screen.findByText(/no files found/i)).toBeInTheDocument();
	});

	it("should render error when submitted with no name or file entered", async () => {
		const file = createFakeFile({
			name: "subtraction.fq.gz",
			type: "subtraction",
		});
		mockFindUploads([file]);
		await openDialog();

		expect(await screen.findByText(file.name)).toBeInTheDocument();
		await userEvent.click(await screen.findByText(/save/i));

		expect(screen.getByText("A name is required")).toBeInTheDocument();
		expect(screen.getByText("Please select a file")).toBeInTheDocument();
	});

	it("should submit correct values when all fields selected", async () => {
		const file = createFakeFile({
			name: "testsubtraction1",
			type: "subtraction",
		});
		const name = "testSubtractionname";
		const nickname = "testSubtractionNickname";

		mockFindUploads([file]);
		const createSubtraction = mockCreateSubtraction(createFakeSubtraction());

		await openDialog();

		await userEvent.type(await screen.findByLabelText("Name"), name);
		await userEvent.type(screen.getByLabelText("Nickname"), nickname);
		await userEvent.click(screen.getByText(/testsubtraction1/i));
		await userEvent.click(screen.getByText(/save/i));

		await waitFor(() =>
			expect(createSubtraction).toHaveBeenCalledWith({
				data: { name, nickname, uploadId: file.id },
			}),
		);
	});
});
