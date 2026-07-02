import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import WorkflowSelector from "../WorkflowSelector";
import { nuvsWorkflow, pathoscopeWorkflow } from "../workflows";

function Harness() {
	const [selected, setSelected] = useState(pathoscopeWorkflow.id);

	return (
		<WorkflowSelector
			workflows={[pathoscopeWorkflow, nuvsWorkflow]}
			selected={selected}
			onChange={setSelected}
		/>
	);
}

describe("<WorkflowSelector>", () => {
	it("renders each workflow as an accessible radio option", () => {
		renderWithProviders(<Harness />);

		expect(screen.getByRole("radiogroup", { name: "Workflow" })).toBeVisible();
		expect(screen.getByRole("radio", { name: "Pathoscope" })).toBeChecked();
		expect(screen.getByRole("radio", { name: "NuVs" })).not.toBeChecked();
	});

	it("selects a workflow when its option is chosen", async () => {
		renderWithProviders(<Harness />);

		await userEvent.click(screen.getByRole("radio", { name: "NuVs" }));

		expect(screen.getByRole("radio", { name: "NuVs" })).toBeChecked();
		expect(screen.getByRole("radio", { name: "Pathoscope" })).not.toBeChecked();
	});

	it("selects a workflow when its label is clicked", async () => {
		renderWithProviders(<Harness />);

		await userEvent.click(screen.getByText("NuVs"));

		expect(screen.getByRole("radio", { name: "NuVs" })).toBeChecked();
	});
});
