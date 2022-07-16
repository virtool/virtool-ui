import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { forEach } from "lodash-es";
import { StatusFilter } from "../StatusFilter";

const jobStates = ["running", "preparing", "waiting", "complete", "error", "failed", "terminated"];

describe("<StatusFilter />", () => {
    let props;

    beforeEach(() => {
        props = { jobStates: [], allCounts: { running: { test_job: 5 } }, onUpdateJobStateFilter: jest.fn() };
    });

    it("should Render", () => {
        renderWithProviders(<StatusFilter {...props} />);
        forEach(jobStates, jobState => expect(screen.getByText(jobState)).toBeInTheDocument());
        expect(screen.getByText("running").textContent === "running 5").toBeTruthy();
    });

    it("should call onUpdateJobStateFilter with correct values when inactive option clicked", () => {
        props.jobStates = ["running"];
        renderWithProviders(<StatusFilter {...props} />);
        userEvent.click(screen.getByText("complete"));
        expect(props.onUpdateJobStateFilter).toHaveBeenCalledWith(["running", "complete"]);
    });
});
