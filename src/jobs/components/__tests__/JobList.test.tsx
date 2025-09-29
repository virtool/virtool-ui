import { JobState, workflows } from "@jobs/types";
import { screen, waitFor } from "@testing-library/react";
import { createFakeJobMinimal, mockApiGetJobs } from "@tests/fake/jobs";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import { describe, expect, it } from "vitest";
import JobsList from "../JobList";

describe("<JobsList />", () => {
    afterEach(() => nock.cleanAll());

    it("should render", async () => {
        const jobs = createFakeJobMinimal({
            progress: 100,
            stage: "",
            state: JobState.complete,
            workflow: workflows.create_sample,
        });
        const scope = mockApiGetJobs([jobs]);
        renderWithRouter(<JobsList />);

        await waitFor(() =>
            expect(screen.queryByLabelText("loading")).not.toBeInTheDocument(),
        );
        expect(screen.getByText("Create Sample")).toBeInTheDocument();

        scope.done();
    });

    it("should show spinner while loading", () => {
        renderWithRouter(<JobsList />);

        expect(screen.getByLabelText("loading")).toBeInTheDocument();
    });

    it("should show message when there are no unarchived jobs", async () => {
        const scope = mockApiGetJobs([]);
        renderWithRouter(<JobsList />);

        await waitFor(() =>
            expect(screen.queryByLabelText("loading")).not.toBeInTheDocument(),
        );
        expect(screen.getByText("No jobs found")).toBeInTheDocument();

        scope.done();
    });

    it("should show message when no jobs match filters", async () => {
        const jobs = createFakeJobMinimal({
            progress: 100,
            stage: "",
            state: JobState.complete,
        });
        const scope = mockApiGetJobs([jobs], 0);
        renderWithRouter(<JobsList />);

        await waitFor(() =>
            expect(screen.queryByLabelText("loading")).not.toBeInTheDocument(),
        );
        expect(
            await screen.findByText("No jobs matching filters"),
        ).toBeInTheDocument();

        scope.done();
    });
});
