import { screen } from "@testing-library/react";
import { connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import React from "react";
import { combineReducers } from "redux";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeSample } from "../../../../../tests/fake/samples";
import {
    createGenericReducer,
    renderWithRouter,
} from "../../../../../tests/setupTests";
import { mapStateToProps, SampleDetailGeneral } from "../SampleDetailGeneral";

function createReducer(state, history) {
    return combineReducers({
        samples: createGenericReducer(state.samples),
        router: connectRouter(history),
    });
}

describe("<SampleDetailGeneral />", () => {
    let props;
    let history;
    let state;

    beforeEach(() => {
        props = {
            count: 235,
            encoding: "Sanger / Illumina 2.1",
            gc: "42.3%",
            lengthRange: "41 - 76",
            sample: createFakeSample({ paired: true }),
            subtractions: [
                {
                    id: "baz",
                    name: "Arabidopsis thaliana",
                },
            ],
            libraryType: "Normal",
        };
        state = {
            samples: { detail: props.sample },
        };
        history = createBrowserHistory();
    });

    it("should render properly", () => {
        renderWithRouter(
            <SampleDetailGeneral {...props} />,
            state,
            history,
            createReducer,
        );

        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText(props.sample.name)).toBeInTheDocument();

        expect(screen.getByText("Host")).toBeInTheDocument();
        expect(screen.getByText(props.sample.host)).toBeInTheDocument();

        expect(screen.getByText("Isolate")).toBeInTheDocument();
        expect(screen.getByText(props.sample.isolate)).toBeInTheDocument();

        expect(screen.getByText("Locale")).toBeInTheDocument();
        expect(screen.getByText(props.sample.locale)).toBeInTheDocument();

        expect(screen.getByText("Encoding")).toBeInTheDocument();
        expect(screen.getByText("Sanger / Illumina 2.1")).toBeInTheDocument();

        expect(screen.getByText("Read Count")).toBeInTheDocument();
        expect(screen.getByText("235")).toBeInTheDocument();

        expect(screen.getByText("Library Type")).toBeInTheDocument();
        expect(screen.getByText("Normal")).toBeInTheDocument();

        expect(screen.getByText("Length Range")).toBeInTheDocument();
        expect(screen.getByText("41 - 76")).toBeInTheDocument();

        expect(screen.getByText("GC Content")).toBeInTheDocument();
        expect(screen.getByText("42.3%")).toBeInTheDocument();
    });

    it("should render with [paired=true]", () => {
        renderWithRouter(
            <SampleDetailGeneral {...props} />,
            state,
            history,
            createReducer,
        );

        expect(screen.getByText("Paired")).toBeInTheDocument();
        expect(screen.getByText("Yes")).toBeInTheDocument();
    });

    it("should render with [paired=false]", () => {
        props.sample = createFakeSample({ paired: false });
        state.samples.detail = props.sample;
        renderWithRouter(
            <SampleDetailGeneral {...props} />,
            state,
            history,
            createReducer,
        );

        expect(screen.getByText("Paired")).toBeInTheDocument();
        expect(screen.getByText("No")).toBeInTheDocument();
    });
});

describe("mapStateToProps()", () => {
    let state;

    beforeEach(() => {
        state = {
            samples: {
                detail: {
                    id: "foo",
                    name: "Foo",
                    host: "Malus domestica",
                    isolate: "Isolate Foo",
                    locale: "Bar",
                    notes: "FooBar",
                    paired: false,
                    quality: {
                        gc: 31.2452,
                        count: 13198329,
                        encoding: "Foo 1.2",
                        length: [50, 100],
                    },
                    library_type: "normal",
                    subtractions: [{ id: "baz", name: "Arabidopsis thaliana" }],
                },
            },
        };
    });

    it("should return props", () => {
        const props = mapStateToProps(state);
        expect(props).toEqual({
            encoding: "Foo 1.2",
            sample: {
                id: "foo",
                host: "Malus domestica",
                isolate: "Isolate Foo",
                locale: "Bar",
                notes: "FooBar",
                name: "Foo",
                paired: false,
                quality: {
                    gc: 31.2452,
                    count: 13198329,
                    encoding: "Foo 1.2",
                    length: [50, 100],
                },
                library_type: "normal",
                subtractions: [{ id: "baz", name: "Arabidopsis thaliana" }],
            },
            gc: "31.2 %",
            count: "13.2 m",
            lengthRange: "50 - 100",
            libraryType: "Normal",
        });
    });

    it.each([
        ["normal", "Normal"],
        ["srna", "sRNA"],
        ["amplicon", "Amplicon"],
    ])("state.library_type(%s) should equal props.libraryType(%s)", (a, b) => {
        state.samples.detail.library_type = a;
        const result = mapStateToProps(state).libraryType;
        expect(result).toEqual(b);
    });
});
