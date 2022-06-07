import { JobsSummary, getAccentColor, mapStateToProps } from "../Summary";
import { screen } from "@testing-library/react";

describe("<JobsSummary />", () => {
    let props;

    beforeEach(() => {
        props = {
            allCounts: {
                error: { jobType1: 1, jobType2: 1, jobType3: 1 },
                running: { jobType1: 1, jobType2: 1 },
                complete: { jobType1: 2, jobType2: 2 }
            }
        };
    });

    it("Should list summary of jobs when called", () => {
        renderWithProviders(<JobsSummary allCounts={props.allCounts} />);
        expect(screen.getByText("error").textContent === "error 3").toBeTruthy();
        expect(screen.getByText("running").textContent === "running 2").toBeTruthy();
        expect(screen.getByText("complete").textContent === "complete 4").toBeTruthy();
    });
});

describe("getAccentColor", () => {
    it.each([
        ["red", "error"],
        ["red", "failed"],
        ["red", "terminated"],
        ["grey", "waiting"],
        ["grey", "preparing"],
        ["blue", "running"],
        ["green", "complete"]
    ])("should return %s when job status is %s", (result, status) => {
        expect(getAccentColor(status)).toBe(result);
    });
});

describe("mapStateToProps", () => {
    let state;

    beforeEach(() => {
        state = {
            jobs: {
                counts: {
                    error: { jobType1: 1, jobType2: 1, jobType3: 1 },
                    running: { jobType1: 1, jobType2: 1 },
                    complete: { jobType1: 2, jobType2: 2 }
                }
            }
        };
    });

    it("Should list summary of jobs when called", () => {
        expect(mapStateToProps(state).allCounts).toBe(state.jobs.counts);
    });
});
