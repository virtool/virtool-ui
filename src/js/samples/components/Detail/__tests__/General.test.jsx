import { createBrowserHistory } from "history";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeSample } from "../../../../../tests/fake/samples";
import { renderWithRouter } from "../../../../../tests/setupTests";
import { mapStateToProps, SampleDetailGeneral } from "../General";

describe("<SampleDetailGeneral />", () => {
    let props;
    let history;

    beforeEach(() => {
        props = {
            count: 235,
            encoding: "Sanger / Illumina 2.1",
            gc: "42.3%",
            lengthRange: "41 - 76",
            sample: {},
            subtractions: [
                {
                    id: "baz",
                    name: "Arabidopsis thaliana",
                },
            ],
            libraryType: "",
        };
        history = createBrowserHistory();
    });

    it("should render with [paired=true]", () => {
        props.sample = createFakeSample({ paired: true });
        renderWithRouter(<SampleDetailGeneral {...props} />, {}, history);

        expect(screen.getByText("Paired")).toBeInTheDocument();
        expect(screen.getByText("Yes")).toBeInTheDocument();
    });

    it("should render with [paired=false]", () => {
        props.sample = createFakeSample({ paired: false });
        renderWithRouter(<SampleDetailGeneral {...props} />, {}, history);

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
