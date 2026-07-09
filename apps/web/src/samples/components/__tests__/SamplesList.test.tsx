import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiListUsers } from "@tests/api/users";
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
import { createFakeUserNested } from "@tests/fake/user";
import { at, renderWithRouter } from "@tests/setup";
import nock from "nock";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import SamplesList from "../SamplesList";

type SamplesListSearch = {
	labels?: number[];
	page?: number;
	term?: string;
	user?: number;
	workflows?: string[];
};

/** Mirrors the route, which maps the ``labels`` search param onto ``filterLabels``. */
function SamplesListHarness({
	initialSearch = { term: "" },
	labels,
}: {
	initialSearch?: SamplesListSearch;
	labels: ReturnType<typeof createFakeLabel>[];
}) {
	const [search, setSearch] = useState<SamplesListSearch>(initialSearch);

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
			user={search.user}
			workflows={search.workflows}
		/>
	);
}

/**
 * Serves a one-sample page for each of two pages, so a selection can be made on
 * one page and asserted on from the other.
 *
 * @returns The sample on each page, in page order
 */
function mockApiGetSamplePages() {
	const documents = [
		createFakeSampleMinimal({ name: "Page One Sample" }),
		createFakeSampleMinimal({ name: "Page Two Sample" }),
	] as const;

	nock.cleanAll();

	documents.forEach((document, index) => {
		const page = index + 1;

		nock("http://localhost")
			.persist()
			.get("/api/samples")
			.query((query) => Number(query.page ?? 1) === page)
			.reply(200, {
				page,
				page_count: documents.length,
				per_page: 1,
				total_count: documents.length,
				found_count: documents.length,
				documents: [document],
			});
	});

	mockApiGetHmms(createFakeHmmSearchResults());
	mockApiListIndexes([createFakeIndexMinimal()]);
	mockApiGetShortlistSubtractions([createFakeShortlistSubtraction()], true);

	return documents;
}

describe("<SamplesList />", () => {
	let samples: ReturnType<typeof createFakeSampleMinimal>[];
	let labels: ReturnType<typeof createFakeLabel>[];
	let users: ReturnType<typeof createFakeUserNested>[];
	const path = "/samples";

	beforeEach(() => {
		samples = [createFakeSampleMinimal(), createFakeSampleMinimal()];
		labels = [createFakeLabel()];
		// Handles are fixed so neither is a substring of the other, keeping the
		// search-input assertions unambiguous.
		users = [
			{ ...createFakeUserNested(), handle: "amelia" },
			{ ...createFakeUserNested(), handle: "bilbo" },
		];
		mockApiListUsers(users);
		mockApiGetSamples(samples);
		mockApiGetHmms(createFakeHmmSearchResults());
		mockApiListIndexes([createFakeIndexMinimal()]);
		mockApiGetShortlistSubtractions([createFakeShortlistSubtraction()], true);
	});

	// The paged sample mocks are persistent, so they have to be torn down rather
	// than left to be overwritten by the next test's interceptors.
	afterEach(() => nock.cleanAll());

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

	describe("user filtering", () => {
		it("should show a chip for a user selected in the dropdown", async () => {
			mockApiGetSamples(samples);
			await renderWithRouter(<SamplesListHarness labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			await userEvent.click(screen.getByRole("button", { name: "User" }));
			await userEvent.click(
				await screen.findByRole("menuitemradio", { name: at(users, 0).handle }),
			);

			const chip = await screen.findByRole("button", {
				name: "Remove user filter",
			});
			expect(chip).toHaveTextContent(at(users, 0).handle);
		});

		it("should list the logged-in user first, tagged as You", async () => {
			const self = at(users, 1);
			mockApiGetAccount(
				createFakeAccount({ id: self.id, handle: self.handle }),
			);
			await renderWithRouter(<SamplesListHarness labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			await userEvent.click(screen.getByRole("button", { name: "User" }));

			const items = await screen.findAllByRole("menuitemradio");
			expect(items.map((item) => item.textContent)).toEqual([
				`${self.handle}You`,
				at(users, 0).handle,
			]);
		});

		it("should narrow the user list as the search input is typed in", async () => {
			await renderWithRouter(<SamplesListHarness labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			await userEvent.click(screen.getByRole("button", { name: "User" }));
			await userEvent.type(
				await screen.findByLabelText("Filter users"),
				at(users, 1).handle,
			);

			expect(
				screen.queryByRole("menuitemradio", { name: at(users, 0).handle }),
			).not.toBeInTheDocument();
			expect(
				screen.getByRole("menuitemradio", { name: at(users, 1).handle }),
			).toBeInTheDocument();
		});

		it("should remove the chip when the dropdown is cleared", async () => {
			mockApiGetSamples(samples);
			mockApiGetSamples(samples);
			await renderWithRouter(<SamplesListHarness labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			await userEvent.click(screen.getByRole("button", { name: "User" }));
			await userEvent.click(
				await screen.findByRole("menuitemradio", { name: at(users, 0).handle }),
			);
			expect(
				await screen.findByRole("button", { name: "Remove user filter" }),
			).toBeInTheDocument();

			await userEvent.click(screen.getByRole("button", { name: "User" }));
			await userEvent.click(
				await screen.findByRole("menuitem", { name: "Clear" }),
			);

			expect(
				screen.queryByRole("button", { name: "Remove user filter" }),
			).not.toBeInTheDocument();
		});
	});

	describe("select all", () => {
		it("should show the sample count until something is selected", async () => {
			await renderWithRouter(<SamplesList labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			expect(screen.getByText("2 samples")).toBeInTheDocument();

			await userEvent.click(
				screen.getByRole("checkbox", { name: `Select ${at(samples, 0).name}` }),
			);

			expect(screen.queryByText("2 samples")).not.toBeInTheDocument();
			expect(screen.getByText("1 selected")).toBeInTheDocument();
		});

		it("should count the samples matching the filters, not every visible sample", async () => {
			nock.cleanAll();
			mockApiListUsers(users);
			mockApiGetHmms(createFakeHmmSearchResults());
			mockApiListIndexes([createFakeIndexMinimal()]);
			mockApiGetShortlistSubtractions([createFakeShortlistSubtraction()], true);
			mockApiGetSamples(samples, { found_count: 2, total_count: 17 });

			await renderWithRouter(<SamplesList labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			expect(screen.getByText("2 samples")).toBeInTheDocument();
			expect(screen.queryByText("17 samples")).not.toBeInTheDocument();
		});

		it("should select every sample on the page", async () => {
			await renderWithRouter(<SamplesList labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			await userEvent.click(
				screen.getByRole("checkbox", { name: "Select all samples" }),
			);

			for (const sample of samples) {
				expect(
					screen.getByRole("checkbox", { name: `Select ${sample.name}` }),
				).toBeChecked();
			}
		});

		it("should complete the selection when only some samples are selected", async () => {
			await renderWithRouter(<SamplesList labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			await userEvent.click(
				screen.getByRole("checkbox", { name: `Select ${at(samples, 0).name}` }),
			);
			await userEvent.click(
				screen.getByRole("checkbox", { name: "Select all samples" }),
			);

			for (const sample of samples) {
				expect(
					screen.getByRole("checkbox", { name: `Select ${sample.name}` }),
				).toBeChecked();
			}
		});

		it("should clear the selection when every sample is already selected", async () => {
			await renderWithRouter(<SamplesList labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			const selectAll = screen.getByRole("checkbox", {
				name: "Select all samples",
			});

			await userEvent.click(selectAll);
			await userEvent.click(selectAll);

			for (const sample of samples) {
				expect(
					screen.getByRole("checkbox", { name: `Select ${sample.name}` }),
				).not.toBeChecked();
			}
		});

		it("should show a mixed state when only some samples are selected", async () => {
			await renderWithRouter(<SamplesList labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			const selectAll = screen.getByRole("checkbox", {
				name: "Select all samples",
			});
			expect(selectAll).not.toBeChecked();

			await userEvent.click(
				screen.getByRole("checkbox", { name: `Select ${at(samples, 0).name}` }),
			);
			expect(selectAll).toBePartiallyChecked();

			await userEvent.click(
				screen.getByRole("checkbox", { name: `Select ${at(samples, 1).name}` }),
			);
			expect(selectAll).toBeChecked();
		});

		it("should leave samples selected on other pages alone", async () => {
			const [first, second] = mockApiGetSamplePages();

			await renderWithRouter(<SamplesListHarness labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			await userEvent.click(
				screen.getByRole("checkbox", { name: `Select ${first.name}` }),
			);
			await userEvent.click(screen.getByRole("button", { name: "2" }));

			expect(await screen.findByText(second.name)).toBeInTheDocument();

			// Selecting and clearing this page must not touch the page-one selection.
			const selectAll = screen.getByRole("checkbox", {
				name: "Select all samples",
			});
			expect(selectAll).not.toBeChecked();

			await userEvent.click(selectAll);
			expect(screen.getByText("2 selected")).toBeInTheDocument();

			await userEvent.click(selectAll);
			expect(screen.getByText("1 selected")).toBeInTheDocument();
		});

		it("should clear the selection when a filter changes", async () => {
			mockApiGetSamples(samples);
			await renderWithRouter(<SamplesListHarness labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			await userEvent.click(
				screen.getByRole("checkbox", { name: `Select ${at(samples, 0).name}` }),
			);
			expect(screen.getByText("1 selected")).toBeInTheDocument();

			const label = at(labels, 0);

			await userEvent.click(screen.getByRole("button", { name: "Labels" }));
			await userEvent.click(
				await screen.findByRole("menuitemcheckbox", {
					name: new RegExp(label.name),
				}),
			);

			expect(await screen.findByText("2 samples")).toBeInTheDocument();
			expect(screen.queryByText("1 selected")).not.toBeInTheDocument();
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

		it("should count a single-sample selection from the header", async () => {
			await renderWithRouter(<SamplesList labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			await userEvent.click(
				screen.getByRole("checkbox", { name: `Select ${at(samples, 0).name}` }),
			);
			await userEvent.click(screen.getByRole("button", { name: "Analyze" }));

			const dialog = await screen.findByRole("dialog");

			const title = within(dialog).getByText("Selected Samples");
			expect(within(title).getByText("1")).toBeInTheDocument();
		});

		it("should include every selected sample when triggered from the header", async () => {
			await renderWithRouter(<SamplesList labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			await userEvent.click(
				screen.getByRole("checkbox", { name: "Select all samples" }),
			);
			await userEvent.click(screen.getByRole("button", { name: "Analyze" }));

			const dialog = await screen.findByRole("dialog");

			const title = within(dialog).getByText("Selected Samples");
			expect(within(title).getByText("2")).toBeInTheDocument();

			for (const sample of samples) {
				expect(within(dialog).getByText(sample.name)).toBeInTheDocument();
			}
		});

		it("should include samples selected on an earlier page", async () => {
			const [first, second] = mockApiGetSamplePages();

			await renderWithRouter(<SamplesListHarness labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			await userEvent.click(
				screen.getByRole("checkbox", { name: `Select ${first.name}` }),
			);
			await userEvent.click(screen.getByRole("button", { name: "2" }));

			expect(await screen.findByText(second.name)).toBeInTheDocument();

			await userEvent.click(
				screen.getByRole("checkbox", { name: `Select ${second.name}` }),
			);
			await userEvent.click(screen.getByRole("button", { name: "Analyze" }));

			const dialog = await screen.findByRole("dialog");

			const title = within(dialog).getByText("Selected Samples");
			expect(within(title).getByText("2")).toBeInTheDocument();
			expect(within(dialog).getByText(first.name)).toBeInTheDocument();
			expect(within(dialog).getByText(second.name)).toBeInTheDocument();
		});

		it("should not show the quick analyze button until samples are selected", async () => {
			await renderWithRouter(<SamplesList labels={labels} />, path);
			expect(await screen.findByText("Samples")).toBeInTheDocument();

			expect(
				screen.queryByRole("button", { name: "Analyze" }),
			).not.toBeInTheDocument();

			await userEvent.click(
				screen.getByRole("checkbox", { name: `Select ${at(samples, 0).name}` }),
			);

			expect(
				screen.getByRole("button", { name: "Analyze" }),
			).toBeInTheDocument();
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
	});

	describe("empty state", () => {
		beforeEach(() => {
			// The default samples interceptor is already registered, and it would
			// answer the request before any empty one added here.
			nock.cleanAll();
			mockApiGetSamples([]).persist();
			mockApiGetHmms(createFakeHmmSearchResults());
			mockApiListIndexes([createFakeIndexMinimal()]);
			mockApiGetShortlistSubtractions([createFakeShortlistSubtraction()], true);
		});

		afterEach(() => nock.cleanAll());

		it("should say no samples exist when no filters are active", async () => {
			await renderWithRouter(<SamplesListHarness labels={labels} />, path);

			expect(await screen.findByText("No samples")).toBeInTheDocument();
			expect(
				screen.getByText("No samples have been created yet."),
			).toBeInTheDocument();
			expect(
				screen.queryByRole("button", { name: "Clear filters" }),
			).not.toBeInTheDocument();
		});

		it.each([
			["a search term", { term: "ferret" }],
			["a label", { labels: [1] }],
			["a workflow", { workflows: ["pathoscope_bowtie:complete"] }],
			["a user", { user: 1 }],
		])("should say no samples match when %s is active", async (_, search) => {
			await renderWithRouter(
				<SamplesListHarness initialSearch={search} labels={labels} />,
				path,
			);

			expect(
				await screen.findByText("No matching samples"),
			).toBeInTheDocument();
			expect(
				screen.getByText("No samples match the current filters."),
			).toBeInTheDocument();
			expect(screen.queryByText("No samples")).not.toBeInTheDocument();
		});

		it("should clear every filter when clear filters is clicked", async () => {
			await renderWithRouter(
				<SamplesListHarness
					initialSearch={{ labels: [at(labels, 0).id], term: "ferret" }}
					labels={labels}
				/>,
				path,
			);

			await userEvent.click(
				await screen.findByRole("button", { name: "Clear filters" }),
			);

			expect(await screen.findByText("No samples")).toBeInTheDocument();
			expect(screen.getByPlaceholderText("Sample name")).toHaveValue("");
			expect(
				screen.queryByRole("button", { name: "Remove user filter" }),
			).not.toBeInTheDocument();
		});
	});
});
