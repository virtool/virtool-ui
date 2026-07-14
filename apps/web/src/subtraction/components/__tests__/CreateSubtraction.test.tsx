import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeFile, mockApiListFiles } from "@tests/fake/files";
import { mockApiCreateSubtraction } from "@tests/fake/subtractions";
import { renderWithRouter } from "@tests/setup";
import { describe, expect, it } from "vitest";
import SubtractionCreate from "../SubtractionCreate";

async function openDialog() {
	await renderWithRouter(<SubtractionCreate />);
	await userEvent.click(screen.getByRole("button", { name: "Create" }));
}

describe("<SubtractionCreate />", () => {
	it("should render when no uploads available", async () => {
		mockApiListFiles([]);
		await openDialog();

		expect(await screen.findByText(/no files found/i)).toBeInTheDocument();
	});

	it("should render error when submitted with no name or file entered", async () => {
		const file = createFakeFile({
			name: "subtraction.fq.gz",
			type: "subtraction",
		});
		mockApiListFiles([file]);
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

		mockApiListFiles([file]);
		const createSubtractionScope = mockApiCreateSubtraction(
			name,
			nickname,
			file.id,
		);

		await openDialog();

		await userEvent.type(await screen.findByLabelText("Name"), name);
		await userEvent.type(screen.getByLabelText("Nickname"), nickname);
		await userEvent.click(screen.getByText(/testsubtraction1/i));
		await userEvent.click(screen.getByText(/save/i));

		await waitFor(() => createSubtractionScope.done());
	});
});
