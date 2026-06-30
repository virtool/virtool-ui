import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import type { SubtractionOption } from "@/subtraction/types";
import SubtractionSelector from "../SubtractionSelector";

const subtractions: SubtractionOption[] = [
	{ id: "arabidopsis", name: "Arabidopsis", ready: true, isDefault: true },
	{ id: "human", name: "Human", ready: true },
	{ id: "mouse", name: "Mouse", ready: true },
	{ id: "rice", name: "Rice", ready: true },
];

function Harness({ initialSelected = [] }: { initialSelected?: string[] }) {
	const [selected, setSelected] = useState(initialSelected);

	return (
		<SubtractionSelector
			subtractions={subtractions}
			selected={selected}
			onChange={setSelected}
		/>
	);
}

async function openMenu(): Promise<void> {
	await userEvent.click(screen.getByRole("button", { name: /toggle menu/i }));
}

describe("<SubtractionSelector>", () => {
	it("exposes an accessible combobox labelled 'Subtractions'", () => {
		renderWithProviders(<Harness />);

		expect(
			screen.getByRole("combobox", { name: "Subtractions" }),
		).toBeVisible();
	});

	it("lists the available subtractions as options when opened", async () => {
		renderWithProviders(<Harness />);

		await openMenu();

		const options = screen.getAllByRole("option");
		expect(options.map((o) => o.textContent)).toEqual([
			"ArabidopsisDefault",
			"Human",
			"Mouse",
			"Rice",
		]);
	});

	it("adds a subtraction when its option is chosen", async () => {
		renderWithProviders(<Harness />);

		await openMenu();
		await userEvent.click(screen.getByRole("option", { name: "Mouse" }));

		// Selected items become removable chips and drop out of the option list.
		expect(
			screen.getByRole("button", { name: "Remove Mouse" }),
		).toBeInTheDocument();
		expect(screen.queryByRole("option", { name: "Mouse" })).toBeNull();
	});

	it("renders pre-selected subtractions as chips and hides them from the menu", async () => {
		renderWithProviders(<Harness initialSelected={["human"]} />);

		expect(
			screen.getByRole("button", { name: "Remove Human" }),
		).toBeInTheDocument();

		await openMenu();
		expect(screen.queryByRole("option", { name: "Human" })).toBeNull();
	});

	it("removes a subtraction when its chip close button is clicked", async () => {
		renderWithProviders(<Harness initialSelected={["mouse"]} />);

		await userEvent.click(screen.getByRole("button", { name: "Remove Mouse" }));

		expect(screen.queryByRole("button", { name: "Remove Mouse" })).toBeNull();

		await openMenu();
		expect(screen.getByRole("option", { name: "Mouse" })).toBeInTheDocument();
	});

	it("removes the last chip when Backspace is pressed in the empty input", async () => {
		renderWithProviders(<Harness initialSelected={["human", "mouse"]} />);

		const input = screen.getByRole("combobox", { name: "Subtractions" });
		input.focus();
		await userEvent.keyboard("{Backspace}");

		expect(screen.queryByRole("button", { name: "Remove Mouse" })).toBeNull();
		expect(
			screen.getByRole("button", { name: "Remove Human" }),
		).toBeInTheDocument();
	});

	it("filters the options by the search term", async () => {
		renderWithProviders(<Harness />);

		await openMenu();
		await userEvent.type(
			screen.getByRole("combobox", { name: "Subtractions" }),
			"Mouse",
		);

		expect(screen.getByRole("option", { name: "Mouse" })).toBeInTheDocument();
		expect(screen.queryByRole("option", { name: "Human" })).toBeNull();
	});

	it("marks the default subtraction in both the menu and its chip", async () => {
		renderWithProviders(<Harness />);

		await openMenu();
		const defaultOption = screen.getByRole("option", { name: /Arabidopsis/ });
		expect(within(defaultOption).getByText("Default")).toBeVisible();

		await userEvent.click(defaultOption);
		const chip = screen.getByRole("button", {
			name: "Remove Arabidopsis",
		}).parentElement as HTMLElement;
		expect(within(chip).getByText("(default)")).toBeVisible();
	});
});
