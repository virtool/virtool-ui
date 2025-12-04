import { screen, waitFor } from "@testing-library/react";
import { createFakeServerJobMinimal, mockApiGetJobs } from "@tests/fake/jobs";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import { afterEach, describe, expect, it } from "vitest";
import JobsList from "../JobList";

describe("<JobsList />", () => {
    afterEach(() => nock.cleanAll());

    it("should render", async () => {
        const scope = mockApiGetJobs([
            createFakeServerJobMinimal({
                progress: 100,
                state: "complete",
                workflow: "create_sample",
            }),
        ]);

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
        const scope = mockApiGetJobs(
            [createFakeServerJobMinimal({ progress: 100, state: "complete" })],
            0,
        );

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
