import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ManageLabels, mapDispatchToProps } from "../ManageLabels";
import { BrowserRouter } from "react-router-dom";
import { getSelectedSamples, getSelectedLabels, getPartiallySelectedLabels } from "../../../selectors";
import { vi } from "vitest";

const routerRenderWithProviders = ui => {
    const routerUi = <BrowserRouter> {ui} </BrowserRouter>;
    return renderWithProviders(routerUi);
};

describe("<ManageLabels>", () => {
    let props;
    let state;
    beforeEach(() => {
        state = {
            samples: {
                selected: ["foo_sample"],
                documents: [
                    {
                        name: "Foo Sample",
                        id: "foo_sample",
                        labels: [{ description: "", id: 1, name: "test", color: "#FCA5A5" }]
                    },
                    {
                        name: "Bar Sample",
                        id: "bar_sample",
                        labels: [
                            { description: "", id: 1, name: "test", color: "#FCA5A5" },
                            { description: "", id: 2, name: "test2", color: "#FCA5A5" }
                        ]
                    }
                ]
            }
        };
        props = {
            allLabels: [
                { description: "", id: 1, name: "test", color: "#FCA5A5" },
                { description: "", id: 2, name: "test2", color: "#FCA5A5" },
                { description: "", id: 3, name: "test3", color: "#FCA5A5" }
            ],
            selectedSamples: [
                {
                    name: "Foo Sample",
                    id: "foo_sample",
                    labels: [{ description: "", id: 1, name: "test", color: "#FCA5A5" }]
                }
            ],
            selectedLabels: {
                1: {
                    description: "",
                    id: 1,
                    name: "test",
                    color: "#FCA5A5",
                    allLabeled: true
                }
            },
            partiallySelectedLabels: [],
            onLabelUpdate: vi.fn()
        };
    });

    const updateProps = (props, state) => ({
        ...props,
        selectedSamples: getSelectedSamples(state),
        selectedLabels: getSelectedLabels(state),
        partiallySelectedLabels: getPartiallySelectedLabels(state)
    });

    it("should render", () => {
        const wrapper = shallow(<ManageLabels {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should be disabled if no labels exist", () => {
        props.allLabels = [];
        const wrapper = shallow(<ManageLabels {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should display labels of one selected document", () => {
        renderWithProviders(<ManageLabels {...props} />);
        expect(screen.getByText("test")).toBeInTheDocument();
    });
    it("should display labels of two selected documents", () => {
        state.samples.selected = ["foo_sample", "bar_sample"];
        renderWithProviders(<ManageLabels {...updateProps(props, state)} />);
        expect(screen.getByText(`test2`)).toBeInTheDocument();
    });

    it("should call onLabelUpdate with selectedSamples, selectedLabels, and the label to be changed", () => {
        state.samples.selected = ["foo_sample", "bar_sample"];
        props = updateProps(props, state);
        routerRenderWithProviders(<ManageLabels {...props} />);
        userEvent.click(screen.getByRole("button", { name: "select labels" }));
        userEvent.click(screen.getByRole("button", { name: "test3" }));
        expect(props.onLabelUpdate).toHaveBeenCalledWith(props.selectedSamples, props.selectedLabels, 3);
    });
});

describe("mapDispatchToProps", () => {
    let selectedSamples;
    let selectedLabels;
    let dispatch;
    let onLabelUpdate;

    beforeEach(() => {
        selectedSamples = [
            {
                name: "Foo Sample",
                id: "foo_sample",
                labels: [{ description: "", id: 1, name: "test", color: "#FCA5A5" }]
            },
            {
                name: "Bar Sample",
                id: "bar_sample",
                labels: [
                    { description: "", id: 1, name: "test", color: "#FCA5A5" },
                    { description: "", id: 2, name: "test2", color: "#FCA5A5" }
                ]
            }
        ];
        selectedLabels = {
            1: {
                description: "",
                id: 1,
                name: "test",
                color: "#FCA5A5",
                allLabeled: true
            },
            2: { description: "", id: 2, name: "test2", color: "#FCA5A5", allLabeled: false }
        };
        dispatch = vi.fn();
        onLabelUpdate = mapDispatchToProps(dispatch).onLabelUpdate;
    });

    it("should add new label when label is unselected", () => {
        onLabelUpdate(selectedSamples, selectedLabels, 3);
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenCalledWith({
            payload: { sampleId: "foo_sample", update: { labels: [1, 3] } },
            type: "UPDATE_SAMPLE_REQUESTED"
        });
        expect(dispatch).toHaveBeenCalledWith({
            payload: { sampleId: "bar_sample", update: { labels: [1, 2, 3] } },
            type: "UPDATE_SAMPLE_REQUESTED"
        });
    });

    it("should add new label when label is partly selected", () => {
        onLabelUpdate(selectedSamples, selectedLabels, 2);
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenCalledWith({
            payload: { sampleId: "foo_sample", update: { labels: [1, 2] } },
            type: "UPDATE_SAMPLE_REQUESTED"
        });
    });
    it("remove label from all samples when it is selected for all", () => {
        onLabelUpdate(selectedSamples, selectedLabels, 1);
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenCalledWith({
            payload: { sampleId: "foo_sample", update: { labels: [] } },
            type: "UPDATE_SAMPLE_REQUESTED"
        });
        expect(dispatch).toHaveBeenCalledWith({
            payload: { sampleId: "bar_sample", update: { labels: [2] } },
            type: "UPDATE_SAMPLE_REQUESTED"
        });
    });
});
