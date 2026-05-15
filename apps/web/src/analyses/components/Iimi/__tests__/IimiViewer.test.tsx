import { AnalysisSearchProvider } from "@analyses/components/AnalysisSearchContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeIimiAnalysis } from "@tests/fake/analyses";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { formatData } from "../../../utils";
import { IimiViewer } from "../IimiViewer";

function renderWithAnalysisSearch(
	ui: React.ReactElement,
	search: { sort?: string; find?: string } = {},
) {
	const queryClient = new QueryClient();

	return render(
		<QueryClientProvider client={queryClient}>
			<AnalysisSearchProvider search={search} setSearch={vi.fn()}>
				{ui}
			</AnalysisSearchProvider>
		</QueryClientProvider>,
	);
}

describe("<IimiViewer />", () => {
	let formattedIimiAnalysis;
	let predefinedHits;

	beforeEach(() => {
		formattedIimiAnalysis = formatData({
			...createFakeIimiAnalysis(),
			ready: true,
			workflow: "iimi",
		});

		predefinedHits = [
			{
				...formattedIimiAnalysis.results.hits[0],
				id: "high-prob",
				name: "High Probability Virus",
				abbreviation: "HPV",
				probability: 0.9,
				coverage: 0.3,
			},
			{
				...formattedIimiAnalysis.results.hits[0],
				id: "med-prob",
				name: "Medium Probability Virus",
				abbreviation: "MPV",
				probability: 0.7,
				coverage: 0.8,
			},
			{
				...formattedIimiAnalysis.results.hits[0],
				id: "low-prob",
				name: "Low Probability Virus",
				abbreviation: "LPV",
				probability: 0.3,
				coverage: 0.6,
			},
		];
	});

	it("should render", async () => {
		await renderWithAnalysisSearch(
			<IimiViewer detail={formattedIimiAnalysis} />,
		);

		expect(
			screen.getByText("Iimi is an experimental workflow."),
		).toBeInTheDocument();
		expect(
			screen.getByText("We do not guarantee the accuracy of the results."),
		).toBeInTheDocument();
		expect(
			screen.getByText(/This analysis could become inaccessible at any time/),
		).toBeInTheDocument();

		expect(screen.getByDisplayValue("0.500")).toBeInTheDocument();
		expect(screen.getByText("Sort: PScore")).toBeInTheDocument();

		expect(
			screen.getByText(formattedIimiAnalysis.results.hits[0].name),
		).toBeInTheDocument();
	});

	it.each([
		[
			"probability",
			"PScore",
			["High Probability Virus", "Medium Probability Virus"],
		],
		[
			"coverage",
			"Coverage",
			["Medium Probability Virus", "High Probability Virus"],
		],
		["name", "Name", ["High Probability Virus", "Medium Probability Virus"]],
	])("should sort hits correctly by %s", async (sortKey, expectedText, expectedOrder) => {
		const testAnalysis = {
			...formattedIimiAnalysis,
			results: {
				hits: predefinedHits,
			},
		};

		renderWithAnalysisSearch(<IimiViewer detail={testAnalysis} />, {
			sort: sortKey,
		});

		expect(screen.getByText(`Sort: ${expectedText}`)).toBeInTheDocument();

		const hitElements = screen.getAllByRole("button", {
			name: /virus/i,
		});

		expectedOrder.forEach((expectedName, index) => {
			expect(hitElements[index]).toHaveTextContent(expectedName);
		});
	});

	it("should filter hits by minimum probability", async () => {
		const testAnalysis = {
			...formattedIimiAnalysis,
			results: {
				hits: predefinedHits,
			},
		};

		await renderWithAnalysisSearch(<IimiViewer detail={testAnalysis} />);

		expect(screen.getByText("High Probability Virus")).toBeInTheDocument();
		expect(screen.getByText("Medium Probability Virus")).toBeInTheDocument();

		expect(screen.queryByText("Low Probability Virus")).not.toBeInTheDocument();
	});

	it("should allow expanding OTU details", async () => {
		await renderWithAnalysisSearch(
			<IimiViewer detail={formattedIimiAnalysis} />,
		);

		expect(
			screen.getByText(formattedIimiAnalysis.results.hits[0].name),
		).toBeInTheDocument();

		const otu = screen.getByRole("button", {
			name: new RegExp(formattedIimiAnalysis.results.hits[0].name),
		});
		await userEvent.click(otu);

		const isolate = formattedIimiAnalysis.results.hits[0].isolates[0];
		const expectedIsolateName = `${isolate.source_type} ${isolate.source_name}`;
		expect(
			screen.getByText(new RegExp(expectedIsolateName, "i")),
		).toBeInTheDocument();
	});

	it("should allow changing probability cutoff to show/hide hits", async () => {
		const testAnalysis = {
			...formattedIimiAnalysis,
			results: {
				hits: predefinedHits,
			},
		};

		await renderWithAnalysisSearch(<IimiViewer detail={testAnalysis} />);

		expect(screen.getByText("High Probability Virus")).toBeInTheDocument();
		expect(screen.getByText("Medium Probability Virus")).toBeInTheDocument();
		expect(screen.queryByText("Low Probability Virus")).not.toBeInTheDocument();

		const probabilityInput = screen.getByDisplayValue("0.500");
		await userEvent.clear(probabilityInput);
		await userEvent.type(probabilityInput, "0.8");

		expect(screen.getByText("High Probability Virus")).toBeInTheDocument();
		expect(
			screen.queryByText("Medium Probability Virus"),
		).not.toBeInTheDocument();
		expect(screen.queryByText("Low Probability Virus")).not.toBeInTheDocument();

		await userEvent.clear(probabilityInput);
		await userEvent.type(probabilityInput, "0.2");

		expect(screen.getByText("High Probability Virus")).toBeInTheDocument();
		expect(screen.getByText("Medium Probability Virus")).toBeInTheDocument();
		expect(screen.getByText("Low Probability Virus")).toBeInTheDocument();
	});
});
