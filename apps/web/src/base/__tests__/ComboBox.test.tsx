import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import { describe, expect, it, vi } from "vitest";
import ComboBox from "../ComboBox";

type Group = { id: number; name: string };

const groups: Group[] = [
	{ id: 1, name: "Managers" },
	{ id: 2, name: "Technicians" },
];

function renderComboBox(
	onChange: (item: Group) => void = vi.fn(),
	onTermChange: (term: string) => void = vi.fn(),
) {
	return renderWithProviders(
		<ComboBox<Group>
			label="Add group"
			items={groups}
			selectedItem={null}
			onChange={onChange}
			term=""
			onTermChange={onTermChange}
			itemToKey={(item) => String(item.id)}
			itemToString={(item) => item.name}
		/>,
	);
}

describe("<ComboBox />", () => {
	it("exposes the search input as a combobox to assistive technology", () => {
		renderComboBox();

		const input = screen.getByRole("combobox", { name: "Add group" });

		expect(input).toHaveAttribute("aria-autocomplete", "list");
		expect(input).toHaveAttribute("aria-controls");
		expect(input).toHaveAttribute("aria-expanded", "false");
	});

	it("puts the input in the tab order", async () => {
		renderComboBox();

		await userEvent.tab();

		expect(screen.getByRole("combobox", { name: "Add group" })).toHaveFocus();
	});

	it("opens the menu and selects an option with the keyboard alone", async () => {
		const onChange = vi.fn();
		renderComboBox(onChange);

		await userEvent.tab();
		await userEvent.keyboard("{ArrowDown}");

		expect(screen.getByRole("combobox", { name: "Add group" })).toHaveAttribute(
			"aria-expanded",
			"true",
		);

		await userEvent.keyboard("{ArrowDown}{Enter}");

		expect(onChange).toHaveBeenCalledWith(groups[1]);
	});

	it("marks the active option for screen readers as it is navigated", async () => {
		renderComboBox();

		await userEvent.tab();
		await userEvent.keyboard("{ArrowDown}");

		const input = screen.getByRole("combobox", { name: "Add group" });

		expect(input).toHaveAttribute(
			"aria-activedescendant",
			screen.getByRole("option", { name: "Managers" }).id,
		);

		await userEvent.keyboard("{ArrowDown}");

		expect(input).toHaveAttribute(
			"aria-activedescendant",
			screen.getByRole("option", { name: "Technicians" }).id,
		);
	});

	it("closes the menu on Escape", async () => {
		renderComboBox();

		await userEvent.tab();
		await userEvent.keyboard("{ArrowDown}");

		const input = screen.getByRole("combobox", { name: "Add group" });
		expect(input).toHaveAttribute("aria-expanded", "true");

		await userEvent.keyboard("{Escape}");

		expect(input).toHaveAttribute("aria-expanded", "false");
	});

	it("passes the selected item, not its key, to onChange", async () => {
		const onChange = vi.fn();
		renderComboBox(onChange);

		await userEvent.click(
			screen.getByRole("button", { name: "Toggle Add group menu" }),
		);
		await userEvent.click(screen.getByRole("option", { name: "Managers" }));

		expect(onChange).toHaveBeenCalledWith(groups[0]);
	});

	it("reports the term only as the user types it", async () => {
		const onTermChange = vi.fn();
		renderComboBox(vi.fn(), onTermChange);

		// `term` is held at "" here, so each keystroke starts from empty.
		await userEvent.type(
			screen.getByRole("combobox", { name: "Add group" }),
			"M",
		);

		expect(onTermChange).toHaveBeenCalledWith("M");
	});

	it("leaves the term alone when an option is selected", async () => {
		const onTermChange = vi.fn();
		renderComboBox(vi.fn(), onTermChange);

		await userEvent.click(
			screen.getByRole("button", { name: "Toggle Add group menu" }),
		);
		await userEvent.click(screen.getByRole("option", { name: "Managers" }));

		expect(onTermChange).not.toHaveBeenCalled();
	});

	it("tells the user when nothing matches the term", async () => {
		renderWithProviders(
			<ComboBox<Group>
				label="Add group"
				items={[]}
				selectedItem={null}
				onChange={vi.fn()}
				term="nope"
				onTermChange={vi.fn()}
				itemToKey={(item) => String(item.id)}
				itemToString={(item) => item.name}
			/>,
		);

		await userEvent.click(
			screen.getByRole("button", { name: "Toggle Add group menu" }),
		);

		expect(screen.getByText("No options")).toBeInTheDocument();
	});
});
