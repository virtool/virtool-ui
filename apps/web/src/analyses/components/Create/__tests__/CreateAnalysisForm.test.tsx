import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiCreateAnalysis } from "@tests/api/analyses";
import { mockApiListIndexes } from "@tests/api/indexes";
import { mockApiGetSampleDetail } from "@tests/api/samples";
import { mockApiGetShortlistSubtractions } from "@tests/api/subtractions";
import { createFakeAnalysisMinimal } from "@tests/fake/analyses";
import { createFakeIndexMinimal } from "@tests/fake/indexes";
import { createFakeSample } from "@tests/fake/samples";
import { renderWithRouter } from "@tests/setup";
import { describe, expect, it, vi } from "vitest";
import CreateAnalysisForm from "../CreateAnalysisForm";
import { getCompatibleWorkflows } from "../workflows";

async function renderForm() {
	const onClose = vi.fn();
	const sample = createFakeSample({ subtractions: [] });
	const index = createFakeIndexMinimal({
		ready: true,
		reference: { id: "ref-1", name: "Plant Viruses", data_type: "genome" },
	});

	mockApiListIndexes([index]);
	mockApiGetShortlistSubtractions([]);
	mockApiGetSampleDetail(sample);

	await renderWithRouter(
		<CreateAnalysisForm
			compatibleWorkflows={getCompatibleWorkflows(false)}
			onClose={onClose}
			sampleCount={1}
			sampleIds={[sample.id]}
		/>,
	);

	return { onClose, sample };
}

async function selectReference() {
	const comboboxes = await screen.findAllByRole("combobox");
	const referenceTrigger = comboboxes.find(
		(element) => element.tagName === "BUTTON",
	);
	await userEvent.click(referenceTrigger as HTMLElement);
	await userEvent.click(
		await screen.findByRole("option", { name: /Plant Viruses/ }),
	);
}

describe("<CreateAnalysisForm>", () => {
	it("closes the dialog after creating when 'Create more' is off", async () => {
		const { onClose, sample } = await renderForm();

		const scope = mockApiCreateAnalysis(
			createFakeAnalysisMinimal({ sample: { id: sample.id } }),
		);

		await selectReference();
		await userEvent.click(screen.getByRole("button", { name: "Create" }));

		await waitFor(() => expect(onClose).toHaveBeenCalled());
		scope.done();
	});

	it("keeps the dialog open and shows a toast when 'Create more' is on", async () => {
		const { onClose, sample } = await renderForm();

		const scope = mockApiCreateAnalysis(
			createFakeAnalysisMinimal({ sample: { id: sample.id } }),
		);

		await selectReference();
		await userEvent.click(screen.getByRole("switch", { name: "Create more" }));
		await userEvent.click(screen.getByRole("button", { name: "Create" }));

		expect(await screen.findByText("Analysis created")).toBeInTheDocument();
		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByText("Select a reference")).toBeInTheDocument();
		scope.done();
	});
});
