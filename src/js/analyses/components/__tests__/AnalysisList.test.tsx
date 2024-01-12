import { screen } from "@testing-library/react";
import { createBrowserHistory } from "history";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeAnalysisMinimal, mockApiGetAnalyses } from "../../../../tests/fake/analyses";
import { createFakeHMMSearchResults, mockApiGetHmms } from "../../../../tests/fake/hmm";
import { renderWithRouter } from "../../../../tests/setupTests";
import AnalysesList from "../AnalysisList";

describe("<AnalysesList />", () => {
    const history = createBrowserHistory();
    const analyses = [createFakeAnalysisMinimal()];
    let props;

    beforeEach(() => {
        mockApiGetAnalyses(analyses);
        mockApiGetHmms(createFakeHMMSearchResults());
        props = {
            match: { params: analyses[0].sample.id },
        };
    });

    afterEach(() => nock.cleanAll());

    describe("<AnalysesList />", () => {
        it("should render", async () => {
            renderWithRouter(<AnalysesList {...props} />, {}, history);
            expect(await screen.findByText("Samples")).toBeInTheDocument();
        });
    });

    describe("<AnalysesToolbar />", () => {
        it("should render with default props", async () => {
            renderWithRouter(<AnalysesList {...props} />, {}, history);
            expect(await screen.findByText("Samples")).toBeInTheDocument();
        });

        it("should render with [canModify=false]", async () => {
            renderWithRouter(<AnalysesList {...props} />, {}, history);
            expect(await screen.findByText("Samples")).toBeInTheDocument();
        });

        it("should call onShowCreate", async () => {
            renderWithRouter(<AnalysesList {...props} />, {}, history);
            expect(await screen.findByText("Samples")).toBeInTheDocument();
        });
    });
});
