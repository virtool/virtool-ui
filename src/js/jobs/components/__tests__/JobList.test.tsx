import { configureStore } from "@reduxjs/toolkit";
import { screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../../tests/setupTests";
import { AdministratorRoles } from "../../../administration/types";
import { JobsList, mapDispatchToProps } from "../JobList";

function createAppStore(state) {
    return () =>
        configureStore({
            reducer: state => state,
            preloadedState: state,
        });
}
function renderWithAllProviders(ui, store) {
    const wrappedUI = <BrowserRouter> {ui} </BrowserRouter>;
    renderWithProviders(wrappedUI, store);
}

describe("<JobsList />", () => {
    let props;
    let state;

    beforeEach(() => {
        props = {
            jobs: [
                {
                    created_at: "2022-06-02T17:21:22.668000Z",
                    id: "test_id",
                    progress: 100,
                    stage: "",
                    state: "complete",
                    user: {
                        id: "test_user_id",
                        handle: "user_handle",
                    },
                    workflow: "create_sample",
                },
            ],
            onLoadNextPage: vi.fn(),
        };

        state = {
            jobs: {
                counts: {
                    running: { pathoscope_bowtie: 1, nuvs: 1 },
                    complete: { create_sample: 2, build_index: 2 },
                },
            },
            account: {
                administrator_role: AdministratorRoles.FULL,
            },
            router: { location: new window.URL("https://www.virtool.ca") },
        };
    });

    it("should render", () => {
        renderWithAllProviders(<JobsList {...props} />, createAppStore(state));
        expect(props.onLoadNextPage).toHaveBeenCalled();
        expect(screen.getByText("Create Sample")).toBeInTheDocument();
    });

    it("should show spinner while loading", () => {
        props.jobs = null;
        renderWithAllProviders(<JobsList {...props} />, createAppStore(state));
        expect(screen.getByLabelText("loading")).toBeInTheDocument();
    });

    it("should show message when there are no unarchived jobs", () => {
        props.jobs = [];
        props.noJobs = true;
        renderWithAllProviders(<JobsList {...props} />, createAppStore(state));
        expect(screen.getByText("No jobs found")).toBeInTheDocument();
    });

    it("should show message when no jobs match filters", () => {
        props.jobs = [];
        renderWithAllProviders(<JobsList {...props} />, createAppStore(state));
        expect(screen.getByText("No jobs matching filters")).toBeInTheDocument();
    });
});

describe("mapDispatchToProps", () => {
    it("should return onFind in props", () => {
        const dispatch = vi.fn();
        const props = mapDispatchToProps(dispatch);

        const states = ["running", "preparing"];

        props.onLoadNextPage(states, 1);
        expect(dispatch).toHaveBeenCalledWith({
            payload: { states, page: 1, archived: false },
            type: "FIND_JOBS_REQUESTED",
        });
    });
});
