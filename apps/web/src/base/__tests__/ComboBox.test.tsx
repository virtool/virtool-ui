import { renderWithProviders } from "@tests/setup";
import { describe, expect, it, vi } from "vitest";
import ComboBox from "../ComboBox";

type Group = { id: number; name: string };

function renderComboBox() {
	const groups: Group[] = [
		{ id: 1, name: "Managers" },
		{ id: 2, name: "Technicians" },
	];

	return renderWithProviders(
		<ComboBox
			items={groups}
			term=""
			renderRow={(item: Group) => <span>{item.name}</span>}
			itemToString={(item: Group) => item.name}
			onFilter={vi.fn()}
			onChange={vi.fn()}
		/>,
	);
}

describe("<ComboBox />", () => {
	it("should expose the search input as a combobox to assistive technology", () => {
		const { getByRole } = renderComboBox();

		const input = getByRole("combobox");

		expect(input).toHaveAttribute("aria-autocomplete", "list");
		expect(input).toHaveAttribute("aria-controls");
		expect(input).toHaveAttribute("aria-expanded", "false");
	});
});
