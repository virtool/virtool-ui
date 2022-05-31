import React from "react";
import { map } from "lodash";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { noop } from "lodash-es";
import { CreateAnalysis, mapDispatchToProps, mapStateToProps } from "../Create";

describe("<CreateAnalysis />", () => {
    let props;
    const errorMessages = ["Workflow(s) must be selected", "Reference(s) must be selected"];
    const preloadedState = { hmm: { status: { installed: null } } };

    const renderWithStore = component =>
        renderWithProviders(
            <Provider store={configureStore({ reducer: noop, preloadedState })}>
                <Router history={createBrowserHistory()}>{component}</Router>
            </Provider>
        );

    beforeEach(() => {
        props = {
            accountId: 1,
            compatibleIndexes: [
                {
                    id: "foo",
                    version: 0,
                    reference: {
                        id: "bar",
                        name: "Plant Viruses",
                        data_type: "genome"
                    }
                },
                {
                    id: "two",
                    version: 1,
                    reference: {
                        id: "2",
                        name: "test name 2",
                        data_type: "genome"
                    }
                }
            ],
            dataType: "genome",
            defaultSubtractions: [],
            hasHmm: false,
            sampleId: 0,
            show: true,
            subtractionOptions: [
                { id: "foo", name: "Foo" },
                { id: "bar", name: "Bar" }
            ],
            value: [],
            onAnalyze: jest.fn(),
            onHide: jest.fn(),
            onShortlistSubtractions: jest.fn()
        };
    });

    it("should show errors when required fields aren't selected", () => {
        renderWithStore(<CreateAnalysis {...props} />);
        // Ensure that no error messages appear until the Start button has clicked
        map(errorMessages, error => expect(screen.queryByText(error)).not.toBeInTheDocument());
        userEvent.click(screen.getByRole("button", { name: "Start" }));
        expect(props.onAnalyze).not.toHaveBeenCalled();
        map(errorMessages, error => expect(screen.queryByText(error)).toBeInTheDocument());
    });

    it("should submit with expected values", () => {
        renderWithStore(<CreateAnalysis {...props} />);
        userEvent.click(screen.getByText("Pathoscope"));
        userEvent.click(screen.getByText(props.subtractionOptions[0].name));
        userEvent.click(screen.getByText(props.compatibleIndexes[0].reference.name));
        userEvent.click(screen.getByRole("button", { name: "Start" }));

        expect(props.onAnalyze).toHaveBeenCalledWith(
            props.sampleId,
            [props.compatibleIndexes[0].reference.id],
            [props.subtractionOptions[0].id],
            props.accountId,
            ["pathoscope_bowtie"]
        );
    });

    it("should automatically select default subtractions", () => {
        // Set the default subtractions to the list of subtraction's ids
        props.defaultSubtractions = props.subtractionOptions.map(subtraction => subtraction.id);

        renderWithStore(<CreateAnalysis {...props} />);
        userEvent.click(screen.getByText("Pathoscope"));
        userEvent.click(screen.getByText(props.compatibleIndexes[0].reference.name));
        userEvent.click(screen.getByRole("button", { name: "Start" }));

        expect(props.onAnalyze).toHaveBeenCalledWith(
            props.sampleId,
            [props.compatibleIndexes[0].reference.id],
            props.defaultSubtractions,
            props.accountId,
            ["pathoscope_bowtie"]
        );
    });

    it("should render correctly when workflows empty, dataType = genome and hasHmm = true", () => {
        renderWithStore(<CreateAnalysis {...props} />);
        expect(screen.getByRole("button", { name: "Pathoscope" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "NuVs" })).not.toBeInTheDocument();
        expect(screen.getByText("No workflows selected")).toBeInTheDocument();
        expect(screen.queryByText("All workflows selected")).not.toBeInTheDocument();
    });

    it("should render correctly when hasHmm = true", () => {
        props.hasHmm = true;
        renderWithStore(<CreateAnalysis {...props} />);
        expect(screen.getByRole("button", { name: "Pathoscope" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "NuVs" })).toBeInTheDocument();
        expect(screen.getByText("No workflows selected")).toBeInTheDocument();
        expect(screen.queryByText("All workflows selected")).not.toBeInTheDocument();
    });

    it("should render correctly when subtraction options not empty, value is empty", () => {
        renderWithStore(<CreateAnalysis {...props} />);
        expect(screen.queryByText("No subtractions found")).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText("Filter subtractions")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Bar" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Foo" })).toBeInTheDocument();
        expect(screen.getByText("No subtractions selected")).toBeInTheDocument();
        expect(screen.queryByText("All subtractions selected")).not.toBeInTheDocument();
    });

    it("should render correctly when when compatible indexes is not empty", () => {
        renderWithStore(<CreateAnalysis {...props} />);
        expect(screen.getByRole("button", { name: "Plant Viruses Index Version 0" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "test name 2 Index Version 1" })).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Filter references")).toBeInTheDocument();
        expect(screen.getByText("No references selected")).toBeInTheDocument();
        expect(screen.queryByText("Create one")).not.toBeInTheDocument();
    });

    it("should render correctly when subtractions.length = 0", () => {
        props.subtractionOptions = [];
        renderWithStore(<CreateAnalysis {...props} />);
        expect(screen.queryByPlaceholderText("Filter Subtractions")).not.toBeInTheDocument();
        expect(screen.getByText("Create one")).toBeInTheDocument();
        expect(screen.getByText("No subtractions selected")).toBeInTheDocument();
        expect(screen.queryByText("All subtractions selected")).not.toBeInTheDocument();
    });

    it("it should render correctly when compatibleIndexes.length = 0", () => {
        props.compatibleIndexes = [];
        renderWithStore(<CreateAnalysis {...props} />);
        expect(screen.queryByPlaceholderText("Filter References")).not.toBeInTheDocument();
        expect(screen.getByText("Create one")).toBeInTheDocument();
        expect(screen.getByText("No references selected")).toBeInTheDocument();
        expect(screen.queryByText("All references selected")).not.toBeInTheDocument();
    });

    it("should render correctly when all workflows selected", () => {
        renderWithStore(<CreateAnalysis {...props} />);
        screen.getByRole("button", { name: "Pathoscope" }).click();
        expect(screen.getByText("All workflows selected")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Pathoscope" })).not.toBeInTheDocument();
        expect(screen.getByText("Pathoscope")).toBeInTheDocument();
    });

    it("should render correctly when subtractions are selected", () => {
        renderWithStore(<CreateAnalysis {...props} />);
        expect(screen.getByText("No subtractions selected")).toBeInTheDocument();
        screen.getByRole("button", { name: "Foo" }).click();
        expect(screen.queryByRole("button", { name: "Foo" })).not.toBeInTheDocument();
        expect(screen.getByText("Foo")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Bar" })).toBeInTheDocument();
        expect(screen.queryByText("No subtractions selected")).not.toBeInTheDocument();
        screen.getByRole("button", { name: "Bar" }).click();
        expect(screen.getByText("All subtractions selected")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Bar" })).not.toBeInTheDocument();
    });

    it("should render correctly when references are selected", () => {
        renderWithStore(<CreateAnalysis {...props} />);
        expect(screen.getByText("No references selected")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "test name 2 Index Version 1" })).toBeInTheDocument();
        expect(screen.getByText("No references selected")).toBeInTheDocument();
        screen.getByRole("button", { name: "test name 2 Index Version 1" }).click();
        expect(screen.queryByRole("button", { name: "test name 2 Index Version 1" })).not.toBeInTheDocument();
        screen.getByRole("button", { name: "Plant Viruses Index Version 0" }).click();
        expect(screen.getByText("All references selected")).toBeInTheDocument();
    });

    it("should move workflow back to available when x button clicked", () => {
        renderWithStore(<CreateAnalysis {...props} />);
        expect(screen.getByRole("button", { name: "Pathoscope" })).toBeInTheDocument();
        screen.getByRole("button", { name: "Pathoscope" }).click();
        expect(screen.queryByRole("button", { name: "Pathoscope" })).not.toBeInTheDocument();
        expect(screen.getByText("Pathoscope")).toBeInTheDocument();
        screen.getByRole("button", { name: "remove selected workflows" }).click();
        expect(screen.getByText("No workflows selected")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Pathoscope" })).toBeInTheDocument();
    });

    it("should render correctly when selected subtractions are removed", () => {
        renderWithStore(<CreateAnalysis {...props} />);
        screen.getByRole("button", { name: "Foo" }).click();
        screen.getByRole("button", { name: "Bar" }).click();
        expect(screen.queryByPlaceholderText("Filter subtractions")).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Foo" })).not.toBeInTheDocument();
        expect(screen.getByText("Foo")).toBeInTheDocument();
        const deleteButtons = screen.getAllByRole("button", { name: "remove selected subtractions" });
        deleteButtons[0].click();
        expect(screen.getByRole("button", { name: "Foo" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Bar" })).not.toBeInTheDocument();
        expect(screen.queryByText("No subtractions selected")).not.toBeInTheDocument();
        deleteButtons[1].click();
        expect(screen.getByText("No subtractions selected")).toBeInTheDocument();
    });

    it("should render correctly when references are removed", () => {
        renderWithStore(<CreateAnalysis {...props} />);
        expect(screen.getByText("No references selected")).toBeInTheDocument();
        expect(screen.queryByText("All references selected")).not.toBeInTheDocument();
        screen.getByRole("button", { name: "Plant Viruses Index Version 0" }).click();
        screen.getByRole("button", { name: "test name 2 Index Version 1" }).click();
        const deleteButtons = screen.getAllByRole("button", { name: "remove selected references" });
        expect(screen.getByText("All references selected")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Plant Viruses Index version 0" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "test name 2 Index version 1" })).not.toBeInTheDocument();
        deleteButtons[0].click();
        expect(screen.getByRole("button", { name: "Plant Viruses Index Version 0" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "test name 2 Index Version 1" })).not.toBeInTheDocument();
        expect(screen.queryByText("All references selected")).not.toBeInTheDocument();
        expect(screen.queryByText("No references selected")).not.toBeInTheDocument();
        deleteButtons[1].click();
        expect(screen.getByText("No references selected")).toBeInTheDocument();
        expect(screen.queryByText("All references selected")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Plant Viruses Index Version 0" })).toBeInTheDocument();
    });
});

describe("mapStateToProps()", () => {
    it("should return props", () => {
        const state = {
            account: { id: 0 },
            samples: { detail: { library_type: "normal", subtractions: [], id: "foo" } },
            analyses: { readyIndexes: [{ id: 0, reference: { id: 0, data_type: "genome", name: "name" } }] },
            hmms: { total_count: 0 },
            router: { location: { state: undefined } },
            subtraction: { shortlist: null }
        };
        const props = mapStateToProps(state);
        expect(props).toEqual({
            accountId: 0,
            compatibleIndexes: [{ id: 0, reference: { data_type: "genome", id: 0, name: "name" } }],
            dataType: "genome",
            defaultSubtractions: [],
            hasHmm: false,
            sampleId: "foo",
            show: false,
            subtractionOptions: []
        });
    });
});

describe("mapDispatchToProps()", () => {
    let dispatch;
    let props;

    beforeEach(() => {
        dispatch = jest.fn();
        props = mapDispatchToProps(dispatch);
    });

    it("should return onAnalyze() in props", () => {
        props.onAnalyze();
        expect(dispatch).not.toHaveBeenCalled();

        const references = [{ id: "bar", name: "Plant Viruses", data_type: "genome" }];
        const sampleId = 0;
        const userId = 0;
        const workflows = ["workflow"];
        const subtractionIds = [];

        props.onAnalyze(sampleId, references, subtractionIds, userId, workflows);
        expect(dispatch).toHaveBeenCalledWith({
            type: "ANALYZE_REQUESTED",
            payload: {
                refId: references[0],
                sampleId,
                subtractionIds,
                userId,
                workflow: workflows[0]
            }
        });
    });

    it("should return onHide() in props", () => {
        props.onHide();
        expect(dispatch).toHaveBeenCalledWith({ payload: { state: {} }, type: "PUSH_STATE" });
    });

    it("should return onShortlistSubtractions() in props", () => {
        props.onShortlistSubtractions();
        expect(dispatch).toHaveBeenCalledWith({
            type: "LIST_SUBTRACTION_IDS_REQUESTED"
        });
    });
});
