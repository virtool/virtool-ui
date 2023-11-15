import { screen, waitFor } from "@testing-library/react";
import { createBrowserHistory } from "history";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithRouter } from "../../../../../tests/setupTests";
import { ManageLabels } from "../ManageLabels";

describe("<ManageLabels>", () => {
    let props;
    let history;

    beforeEach(() => {
        history = createBrowserHistory();
        props = {
            documents: [],
            selectedSamples: [],
            labels: [
                { color: "#C4B5FD", description: "", id: 1, name: "test" },
                { color: "#FCA5A5", description: "", id: 2, name: "label" },
                { color: "#1D4ED8", description: "", id: 3, name: "bar" },
            ],
            partiallySelectedLabels: [],
        };
    });

    it("should be disabled if no labels exist", async () => {
        props.labels = [];
        renderWithRouter(<ManageLabels {...props} />, {}, history);
        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());

        expect(screen.getByText("Create one")).toBeInTheDocument();
    });

    it("should display labels of one selected document", async () => {
        props.selectedSamples = props.documents = [
            {
                name: "Foo Sample",
                id: "foo_sample",
                labels: [{ color: "#C4B5FD", description: "", id: 1, name: "test" }],
            },
        ];
        renderWithRouter(<ManageLabels {...props} />, {}, history);
        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());

        expect(screen.getByText("test")).toBeInTheDocument();
    });

    it("should display labels of two selected documents", async () => {
        props.selectedSamples = props.documents = [
            {
                name: "Foo Sample",
                id: "foo_sample",
                labels: [{ color: "#C4B5FD", description: "", id: 1, name: "test" }],
            },
            {
                name: "Sample",
                id: "sample",
                labels: [{ color: "#FCA5A5", description: "", id: 2, name: "label" }],
            },
        ];
        renderWithRouter(<ManageLabels {...props} />, {}, history);
        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());

        expect(screen.getByText(`test`)).toBeInTheDocument();
        expect(screen.getByText(`label`)).toBeInTheDocument();
    });
});
