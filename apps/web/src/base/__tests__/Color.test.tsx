import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import { describe, expect, it, vi } from "vitest";
import Color from "../Color";

describe("<Color />", () => {
	it("should call onChange when color clicked or input changed", async () => {
		const onChange = vi.fn();

		const { getByRole } = renderWithProviders(
			<Color id="color" value="#DDDDDD" onChange={onChange} />,
		);

		const textbox = getByRole("textbox");

		// Change the input text value
		expect(textbox).toHaveValue("#DDDDDD");

		// Select a color swatch by its accessible name
		await userEvent.click(getByRole("radio", { name: "Light purple" }));
		expect(onChange).toHaveBeenLastCalledWith("#C4B5FD");

		// Clear the text box to change input value
		await userEvent.clear(textbox);
		expect(onChange).toHaveBeenLastCalledWith("");

		// Type one letter in the textbox
		await userEvent.type(textbox, "A");
		expect(onChange).toHaveBeenLastCalledWith("#DDDDDDA");
	});

	it("marks the swatch matching the value as checked", () => {
		const { getByRole } = renderWithProviders(
			<Color id="color" value="#6B7280" onChange={vi.fn()} />,
		);

		expect(getByRole("radio", { name: "Grey" })).toBeChecked();
		expect(getByRole("radio", { name: "Light purple" })).not.toBeChecked();
	});
});
