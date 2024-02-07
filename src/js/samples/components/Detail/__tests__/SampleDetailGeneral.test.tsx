import { screen } from "@testing-library/react";
import { connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import numbro from "numbro";
import React from "react";
import { combineReducers } from "redux";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeSample, mockApiGetSampleDetail } from "../../../../../tests/fake/samples";
import { createGenericReducer, renderWithRouter } from "../../../../../tests/setupTests";
import SampleDetailGeneral from "../SampleDetailGeneral";

function createReducer(state, history) {
    return combineReducers({
        samples: createGenericReducer(state.samples),
        router: connectRouter(history),
    });
}

describe("<SampleDetailGeneral />", () => {
    let props;
    let history;
    let sample;
    let state;

    beforeEach(() => {
        sample = createFakeSample({ paired: true });
        props = {
            match: { params: { sampleId: sample.id } },
        };
        state = {
            samples: { detail: sample },
        };
        history = createBrowserHistory();
    });

    it("should render properly", async () => {
        const scope = mockApiGetSampleDetail(sample);
        renderWithRouter(<SampleDetailGeneral {...props} />, state, history, createReducer);

        expect(await screen.findByText("Metadata")).toBeInTheDocument();

        expect(screen.getByText("Host")).toBeInTheDocument();
        expect(screen.getByText(sample.host)).toBeInTheDocument();

        expect(screen.getByText("Isolate")).toBeInTheDocument();
        expect(screen.getByText(sample.isolate)).toBeInTheDocument();

        expect(screen.getByText("Locale")).toBeInTheDocument();
        expect(screen.getByText(sample.locale)).toBeInTheDocument();

        expect(screen.getByText("Encoding")).toBeInTheDocument();
        expect(screen.getByText("Sanger / Illumina 1.9")).toBeInTheDocument();

        expect(screen.getByText("Read Count")).toBeInTheDocument();
        expect(screen.getByText(numbro(sample.quality.count).format("0.0 a"))).toBeInTheDocument();

        expect(screen.getByText("Library Type")).toBeInTheDocument();
        expect(screen.getByText("Normal")).toBeInTheDocument();

        expect(screen.getByText("Length Range")).toBeInTheDocument();
        expect(screen.getByText(sample.quality.length.join(" - "))).toBeInTheDocument();

        expect(screen.getByText("GC Content")).toBeInTheDocument();
        expect(screen.getByText(numbro(sample.quality.gc / 100).format("0.0 %"))).toBeInTheDocument();

        scope.done();
    });

    it("should render with [paired=true]", async () => {
        const scope = mockApiGetSampleDetail(sample);
        renderWithRouter(<SampleDetailGeneral {...props} />, state, history, createReducer);

        expect(await screen.findByText("Paired")).toBeInTheDocument();
        expect(screen.getByText("Yes")).toBeInTheDocument();

        scope.done();
    });

    it("should render with [paired=false]", async () => {
        sample = createFakeSample({ paired: false });
        props.match.params.sampleId = sample.id;
        state.samples.detail = sample;
        const scope = mockApiGetSampleDetail(sample);
        renderWithRouter(<SampleDetailGeneral {...props} />, state, history, createReducer);

        expect(await screen.findByText("Paired")).toBeInTheDocument();
        expect(screen.getByText("No")).toBeInTheDocument();

        scope.done();
    });
});
