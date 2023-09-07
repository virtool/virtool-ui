import { screen } from "@testing-library/react";
import { createBrowserHistory } from "history";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithRouter } from "../../../../tests/setupTests";
import { getStateTitle } from "../../../jobs/utils";
import { mapStateToProps, SubtractionItem } from "../Item";

describe("<SubtractionItem />", () => {
    let props;
    let history;

    beforeEach(() => {
        props = {
            id: "foo",
            name: "Foo",
            user: { handle: "user_handle" },
            job: { progress: 50, state: "running" },
            created_at: new Date().setFullYear(new Date().getFullYear() - 1),
        };
        history = createBrowserHistory();
    });

    it("should render", () => {
        renderWithRouter(<SubtractionItem {...props} />, {}, history);
        expect(screen.getByText("Foo")).toBeInTheDocument();
        expect(screen.getByText(/user_handle/)).toBeInTheDocument();
        expect(screen.getByText(/1 year ago/)).toBeInTheDocument();
        expect(screen.getByRole("progressbar")).toHaveAttribute("data-value", "50");
        expect(screen.getByText("Running")).toBeInTheDocument();
    });

    it.each(["waiting", "running", "error"])("should render %s state", state => {
        props.job.state = state;
        renderWithRouter(<SubtractionItem {...props} />, {}, history);
        expect(screen.getByText(getStateTitle(state))).toBeInTheDocument();
    });

    it("should not render progress bar if job is complete", () => {
        props.job.state = "complete";
        renderWithRouter(<SubtractionItem {...props} />, {}, history);
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        expect(screen.queryByText("Complete")).not.toBeInTheDocument();
    });
});

describe("mapStateToProps()", () => {
    it("should return props", () => {
        const state = {
            subtraction: {
                documents: [
                    {
                        id: "foo",
                        name: "Foo",
                        ready: true,
                        user: { id: "user_id_1", handle: "user_handle_1" },
                        job: { id: "job_id_1", progress: 50, state: "running" },
                    },
                    {
                        id: "bar",
                        name: "Bar",
                        ready: true,
                        user: { id: "user_id_2", handle: "user_handle_2" },
                        job: { id: "job_id_2", progress: 50, state: "failed" },
                    },
                    {
                        id: "baz",
                        name: "Baz",
                        ready: true,
                        user: { id: "user_id_3", handle: "user_handle_3" },
                        job: { id: "job_id_2", progress: 100, state: "complete" },
                    },
                ],
            },
        };
        const props = mapStateToProps(state, { index: 1 });
        expect(props).toEqual({
            id: "bar",
            name: "Bar",
            job: { id: "job_id_2", progress: 50, state: "failed" },
            user: { id: "user_id_2", handle: "user_handle_2" },
        });
    });
});
