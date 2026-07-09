import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakeHmmSearchResults, mockApiGetHmms } from "@tests/fake/hmm";
import {
	createFakeIndexMinimal,
	mockApiListIndexes,
} from "@tests/fake/indexes";
import { createFakeLabel } from "@tests/fake/labels";
import {
	createFakeSampleMinimal,
	mockApiGetSamples,
} from "@tests/fake/samples";
import {
	createFakeShortlistSubtraction,
	mockApiGetShortlistSubtractions,
} from "@tests/fake/subtractions";
import { at, renderWithRouter } from "@tests/setup";
import { useState } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import SamplesList from "../SamplesList";

type SamplesListSearch = {
	filterLabels?: number[];
	page?: number;
	term?: string;
	workflows?: string[];
};

function SamplesListHarness({
	labels,
}: {
	labels: ReturnType<typeof createFakeLabel>[];
}) {
	const [search, setSearch] = useState<SamplesListSearch>({ term: "" });

	function handleSetSearch(next: SamplesListSearch) {
		setSearch((prev) => ({ ...prev, ...next }));
	}

	return (
		<SamplesList labels={labels} {...search} setSearch={handleSetSearch} />
	);
}

describe("<SamplesList />", () => {
	let samples: ReturnType<typeof createFakeSampleMinimal>[];
	let labels: ReturnType<typeof createFakeLabel>[];
	const path = "/samples";

	beforeEach(() => {
		samples = [createFakeSampleMinimal(), createFakeSampleMinimal()];
		labels = [createFakeLabel()];
		mockApiGetSamples(samples);
		mockApiGetHmms(createFakeHmmSearchResults());
		mockApiListIndexes([createFakeIndexMinimal()]);
		mockApiGetShortlistSubtractions([createFakeShortlistSubtraction()], true);
	});

	it("should render correctly", async () => {
		await renderWithRouter(<SamplesList labels={labels} />, path);
		expect(await screen.findByText("Samples")).toBeInTheDocument();

		expect(screen.getByText(at(samples, 0).name)).toBeInTheDocument();
		expect(screen.getByText("Labels")).toBeInTheDocument();
	});

	it("should call onChange when search input changes in toolbar", async () => {
		mockApiGetSamples(samples);
		mockApiGetSamples(samples);
		mockApiGetSamples(samples);
		await renderWithRouter(<SamplesListHarness labels={labels} />, path);
		expect(await screen.findByText("Samples")).toBeInTheDocument();

		const inputElement = screen.getByPlaceholderText("Sample name");
		expect(inputElement).toHaveValue("");

		await userEvent.type(inputElement, "Foo");
		expect(inputElement).toHaveValue("Foo");
	});

	it("should render create button when [canModify=true]", async () => {
		mockApiGetAccount(
			createFakeAccount({
				administrator_role: "full",
			}),
		);
		await renderWithRouter(<SamplesList labels={labels} />, path);

		expect(
			await screen.findByRole("link", { name: "Create" }),
		).toBeInTheDocument();
	});

	it("should not render create button when [canModify=false]", async () => {
		mockApiGetAccount(createFakeAccount({ administrator_role: null }));
		await renderWithRouter(<SamplesList labels={labels} />, path);

		expect(
			screen.queryByRole("link", { name: "Create" }),
		).not.toBeInTheDocument();
	});

	describe("quick analyze", () => {
		it("should scope to the clicked sample, ignoring the selection", async () => {
			await renderWithRouter(<SamplesList labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			const selectedSample = at(samples, 0);
			const clickedSample = at(samples, 1);

			await userEvent.click(
				screen.getByRole("checkbox", { name: `Select ${selectedSample.name}` }),
			);
			await userEvent.click(
				screen.getByRole("button", {
					name: `Quick analyze ${clickedSample.name}`,
				}),
			);

			const dialog = await screen.findByRole("dialog");

			expect(within(dialog).getByText(clickedSample.name)).toBeInTheDocument();
			expect(
				within(dialog).queryByText(selectedSample.name),
			).not.toBeInTheDocument();
		});

		it("should leave the existing selection intact after a row is analyzed", async () => {
			await renderWithRouter(<SamplesList labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			const selectedSample = at(samples, 0);
			const clickedSample = at(samples, 1);

			await userEvent.click(
				screen.getByRole("checkbox", { name: `Select ${selectedSample.name}` }),
			);
			await userEvent.click(
				screen.getByRole("button", {
					name: `Quick analyze ${clickedSample.name}`,
				}),
			);

			expect(await screen.findByRole("dialog")).toBeInTheDocument();

			await userEvent.keyboard("{Escape}");
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

			expect(
				screen.getByRole("checkbox", { name: `Select ${selectedSample.name}` }),
			).toBeChecked();
			expect(
				screen.getByRole("checkbox", { name: `Select ${clickedSample.name}` }),
			).not.toBeChecked();
		});

		it("should include every selected sample when triggered from the toolbar", async () => {
			await renderWithRouter(<SamplesList labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			for (const sample of samples) {
				await userEvent.click(
					screen.getByRole("checkbox", { name: `Select ${sample.name}` }),
				);
			}

			await userEvent.click(
				screen.getByRole("button", { name: "Quick Analyze" }),
			);

			const dialog = await screen.findByRole("dialog");

			for (const sample of samples) {
				expect(within(dialog).getByText(sample.name)).toBeInTheDocument();
			}
		});
	});
});
