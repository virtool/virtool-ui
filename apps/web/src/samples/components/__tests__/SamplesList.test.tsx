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
	labels?: number[];
	page?: number;
	term?: string;
	workflows?: string[];
};

/** Mirrors the route, which maps the ``labels`` search param onto ``filterLabels``. */
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
		<SamplesList
			filterLabels={search.labels}
			labels={labels}
			page={search.page}
			setSearch={handleSetSearch}
			term={search.term}
			workflows={search.workflows}
		/>
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
		expect(screen.getByRole("button", { name: "Labels" })).toBeInTheDocument();
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

	describe("label filtering", () => {
		it("should show a chip for a label selected in the dropdown", async () => {
			mockApiGetSamples(samples);
			await renderWithRouter(<SamplesListHarness labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			const label = at(labels, 0);

			await userEvent.click(screen.getByRole("button", { name: "Labels" }));
			await userEvent.click(
				await screen.findByRole("menuitemcheckbox", {
					name: new RegExp(label.name),
				}),
			);

			expect(
				await screen.findByRole("button", {
					name: `Remove ${label.name} label filter`,
				}),
			).toBeInTheDocument();
		});

		it("should remove every chip when the dropdown is cleared", async () => {
			mockApiGetSamples(samples);
			mockApiGetSamples(samples);
			await renderWithRouter(<SamplesListHarness labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			const label = at(labels, 0);
			const removeChipName = `Remove ${label.name} label filter`;

			await userEvent.click(screen.getByRole("button", { name: "Labels" }));
			await userEvent.click(
				await screen.findByRole("menuitemcheckbox", {
					name: new RegExp(label.name),
				}),
			);
			expect(
				await screen.findByRole("button", { name: removeChipName }),
			).toBeInTheDocument();

			await userEvent.click(screen.getByRole("menuitem", { name: "Clear" }));

			expect(
				screen.queryByRole("button", { name: removeChipName }),
			).not.toBeInTheDocument();
		});

		it("should show a chip for the search term", async () => {
			mockApiGetSamples(samples);
			mockApiGetSamples(samples);
			await renderWithRouter(<SamplesListHarness labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			await userEvent.type(screen.getByPlaceholderText("Sample name"), "Foo");

			expect(
				await screen.findByRole("button", { name: "Clear search term" }),
			).toBeInTheDocument();
			expect(screen.getByText("Search")).toBeInTheDocument();
		});
	});

	describe("workflow filtering", () => {
		it("should show a chip for a workflow state selected in the dropdown", async () => {
			mockApiGetSamples(samples);
			await renderWithRouter(<SamplesListHarness labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			await userEvent.click(screen.getByRole("button", { name: "Workflows" }));

			const item = await screen.findByRole("menuitemcheckbox", {
				name: "Pathoscope Complete",
			});
			expect(item).toHaveAttribute("aria-checked", "false");

			await userEvent.click(item);

			expect(
				await screen.findByRole("button", {
					name: "Remove Pathoscope Complete filter",
				}),
			).toBeInTheDocument();
		});

		it("should keep the menu open and check both states toggled for one workflow", async () => {
			mockApiGetSamples(samples);
			mockApiGetSamples(samples);
			await renderWithRouter(<SamplesListHarness labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			await userEvent.click(screen.getByRole("button", { name: "Workflows" }));

			await userEvent.click(
				await screen.findByRole("menuitemcheckbox", {
					name: "Nuvs In progress",
				}),
			);
			await userEvent.click(
				screen.getByRole("menuitemcheckbox", { name: "Nuvs Complete" }),
			);

			expect(
				screen.getByRole("menuitemcheckbox", { name: "Nuvs In progress" }),
			).toHaveAttribute("aria-checked", "true");
			expect(
				screen.getByRole("menuitemcheckbox", { name: "Nuvs Complete" }),
			).toHaveAttribute("aria-checked", "true");
		});

		it("should remove every workflow chip when the dropdown is cleared", async () => {
			mockApiGetSamples(samples);
			mockApiGetSamples(samples);
			await renderWithRouter(<SamplesListHarness labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			const removeChipName = "Remove Pathoscope Not analyzed filter";

			await userEvent.click(screen.getByRole("button", { name: "Workflows" }));
			await userEvent.click(
				await screen.findByRole("menuitemcheckbox", {
					name: "Pathoscope Not analyzed",
				}),
			);
			expect(
				await screen.findByRole("button", { name: removeChipName }),
			).toBeInTheDocument();

			await userEvent.click(screen.getByRole("menuitem", { name: "Clear" }));

			expect(
				screen.queryByRole("button", { name: removeChipName }),
			).not.toBeInTheDocument();
		});
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

		it("should title a single clicked sample without a count", async () => {
			await renderWithRouter(<SamplesList labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			await userEvent.click(
				screen.getByRole("button", {
					name: `Quick analyze ${at(samples, 0).name}`,
				}),
			);

			const dialog = await screen.findByRole("dialog");

			expect(within(dialog).getByText("Selected Sample")).toBeInTheDocument();
			expect(
				within(dialog).queryByText("Selected Samples"),
			).not.toBeInTheDocument();
		});

		it("should count a single-sample selection from the toolbar", async () => {
			await renderWithRouter(<SamplesList labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			await userEvent.click(
				screen.getByRole("checkbox", { name: `Select ${at(samples, 0).name}` }),
			);
			await userEvent.click(
				screen.getByRole("button", { name: "Quick Analyze" }),
			);

			const dialog = await screen.findByRole("dialog");

			const title = within(dialog).getByText("Selected Samples");
			expect(within(title).getByText("1")).toBeInTheDocument();
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

			const title = within(dialog).getByText("Selected Samples");
			expect(within(title).getByText("2")).toBeInTheDocument();

			for (const sample of samples) {
				expect(within(dialog).getByText(sample.name)).toBeInTheDocument();
			}
		});
	});
});
