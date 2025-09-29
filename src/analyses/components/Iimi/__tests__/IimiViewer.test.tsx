import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeIimiAnalysis } from "@tests/fake/analyses";
import { renderWithRouter } from "@tests/setup";
import { beforeEach, describe, expect, it } from "vitest";
import { formatData } from "../../../utils";
import { IimiViewer } from "../IimiViewer";

describe("<IimiViewer />", () => {
    let iimiAnalysis;
    let formattedIimiAnalysis;
    let predefinedHits;

    beforeEach(() => {
        iimiAnalysis = createFakeIimiAnalysis();
        iimiAnalysis.workflow = "iimi";
        iimiAnalysis.ready = true;
        formattedIimiAnalysis = formatData(iimiAnalysis);

        // Define three hits with known values for testing
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

    it("should render IIMI viewer with experimental workflow warning", async () => {
        renderWithRouter(<IimiViewer detail={formattedIimiAnalysis} />);

        expect(
            screen.getByText("Iimi is an experimental workflow."),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "We do not guarantee the accuracy of the results.",
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /This analysis could become inaccessible at any time/,
            ),
        ).toBeInTheDocument();
    });

    it("should render IIMI toolbar with probability filter and search", () => {
        renderWithRouter(<IimiViewer detail={formattedIimiAnalysis} />);

        expect(screen.getByDisplayValue("0.500")).toBeInTheDocument();
        expect(screen.getByText("Sort: PScore")).toBeInTheDocument();
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
        [
            "name",
            "Name",
            ["High Probability Virus", "Medium Probability Virus"],
        ],
    ])(
        "should sort hits correctly by %s",
        (sortKey, expectedText, expectedOrder) => {
            const testAnalysis = {
                ...formattedIimiAnalysis,
                results: {
                    hits: predefinedHits,
                },
            };

            renderWithRouter(
                <IimiViewer detail={testAnalysis} />,
                `/?sort=${sortKey}`,
            );

            expect(
                screen.getByText(`Sort: ${expectedText}`),
            ).toBeInTheDocument();

            const hitElements = screen.getAllByRole("button", {
                name: /virus/i,
            });

            expectedOrder.forEach((expectedName, index) => {
                expect(hitElements[index]).toHaveTextContent(expectedName);
            });
        },
    );

    it("should render IIMI hits in accordion format", () => {
        renderWithRouter(<IimiViewer detail={formattedIimiAnalysis} />);

        expect(
            screen.getByText(formattedIimiAnalysis.results.hits[0].name),
        ).toBeInTheDocument();
    });

    it("should filter hits by minimum probability", () => {
        const testAnalysis = {
            ...formattedIimiAnalysis,
            results: {
                hits: predefinedHits,
            },
        };

        renderWithRouter(<IimiViewer detail={testAnalysis} />);

        // Should show high (0.9) and medium (0.7) probability hits (both >= 0.5 default threshold)
        expect(screen.getByText("High Probability Virus")).toBeInTheDocument();
        expect(
            screen.getByText("Medium Probability Virus"),
        ).toBeInTheDocument();

        // Should not show low probability hit (0.3 < 0.5 threshold)
        expect(
            screen.queryByText("Low Probability Virus"),
        ).not.toBeInTheDocument();
    });

    it("should allow expanding OTU details", async () => {
        renderWithRouter(<IimiViewer detail={formattedIimiAnalysis} />);

        expect(
            screen.getByText(formattedIimiAnalysis.results.hits[0].name),
        ).toBeInTheDocument();

        const otu = screen.getByRole("button", {
            name: new RegExp(formattedIimiAnalysis.results.hits[0].name),
        });
        await userEvent.click(otu);

        // Check that isolate details are visible after expansion
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

        renderWithRouter(<IimiViewer detail={testAnalysis} />);

        // Initially should show high (0.9) and medium (0.7) probability hits (both >= 0.5 default threshold)
        expect(screen.getByText("High Probability Virus")).toBeInTheDocument();
        expect(
            screen.getByText("Medium Probability Virus"),
        ).toBeInTheDocument();
        expect(
            screen.queryByText("Low Probability Virus"),
        ).not.toBeInTheDocument();

        // Change threshold to 0.8 to filter out medium probability hit
        const probabilityInput = screen.getByDisplayValue("0.500");
        await userEvent.clear(probabilityInput);
        await userEvent.type(probabilityInput, "0.8");

        // Now should only show high probability hit
        expect(screen.getByText("High Probability Virus")).toBeInTheDocument();
        expect(
            screen.queryByText("Medium Probability Virus"),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText("Low Probability Virus"),
        ).not.toBeInTheDocument();

        // Change threshold to 0.2 to show all hits
        await userEvent.clear(probabilityInput);
        await userEvent.type(probabilityInput, "0.2");

        // Now should show all three hits
        expect(screen.getByText("High Probability Virus")).toBeInTheDocument();
        expect(
            screen.getByText("Medium Probability Virus"),
        ).toBeInTheDocument();
        expect(screen.getByText("Low Probability Virus")).toBeInTheDocument();
    });
});
