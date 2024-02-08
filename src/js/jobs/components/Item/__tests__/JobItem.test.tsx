import { screen } from "@testing-library/react";
import { createBrowserHistory } from "history";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeUserNested } from "../../../../../tests/fake/user";
import { renderWithRouter } from "../../../../../tests/setupTests";
import JobItem from "../JobItem";

describe("<JobItem />", () => {
    let props;
    let history;

    beforeEach(() => {
        props = {
            id: "foo",
            workflow: "build_index",
            created_at: "2022-12-22T21:37:49.429000Z",
            user: createFakeUserNested(),
        };
        history = createBrowserHistory();
    });

    describe("<JobItem />", () => {
        it("should render properly", () => {
            renderWithRouter(<JobItem {...props} />, {}, history);

            expect(screen.getByText("Build Index")).toBeInTheDocument();
            expect(screen.getByText(`${props.user.handle} created`)).toBeInTheDocument();
        });
    });

    describe("<JobStatus />", () => {
        it.each([
            ["waiting", 0],
            ["preparing", 0],
            ["running", 40],
            ["cancelled", 45],
            ["error", 25],
        ])("and [state=%p]", (state, progress) => {
            props.state = state;
            props.progress = progress;
            const capitalizedState = state.charAt(0).toUpperCase() + state.slice(1);
            renderWithRouter(<JobItem {...props} />, {}, history);

            expect(screen.getByText(capitalizedState)).toBeInTheDocument();
            expect(screen.getByRole("progressbar")).toHaveAttribute("data-value", `${progress}`);
        });

        it("should render properly when job is complete", () => {
            props.state = "complete";
            props.progress = 100;
            const capitalizedState = props.state.charAt(0).toUpperCase() + props.state.slice(1);
            renderWithRouter(<JobItem {...props} />, {}, history);

            expect(screen.getByText(capitalizedState)).toBeInTheDocument();
            expect(screen.queryByRole("progressbar")).toBeNull();
        });
    });
});
