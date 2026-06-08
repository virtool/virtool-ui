import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakeHmmSearchResults, mockApiGetHmms } from "@tests/fake/hmm";
import {
	createFakeIndexMinimal,
	mockApiListIndexes,
} from "@tests/fake/indexes";
import { createFakeLabel } from "@tests/fake/labels";
import { createFakeMLModelMinimal, mockApiGetModels } from "@tests/fake/ml";
import {
	createFakeSampleMinimal,
	mockApiGetSamples,
} from "@tests/fake/samples";
import {
	createFakeShortlistSubtraction,
	mockApiGetShortlistSubtractions,
} from "@tests/fake/subtractions";
import { renderWithRouter } from "@tests/setup";
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
		mockApiGetModels([createFakeMLModelMinimal()]);
		mockApiGetShortlistSubtractions([createFakeShortlistSubtraction()], true);
	});

	it("should render correctly", async () => {
		await renderWithRouter(<SamplesList labels={labels} />, path);
		expect(await screen.findByText("Samples")).toBeInTheDocument();

		expect(screen.getByText(samples[0].name)).toBeInTheDocument();
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
});
