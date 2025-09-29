import { screen } from "@testing-library/react";
import { renderWithRouter } from "@tests/setup";
import { beforeEach, describe, expect, it } from "vitest";
import { SubtractionItem } from "../SubtractionItem";

describe("<SubtractionItem />", () => {
    let props;

    beforeEach(() => {
        props = {
            id: "foo",
            name: "Foo",
            nickname: "testNickname",
            user: { handle: "user_handle" },
            job: { progress: 50, state: "running" },
            created_at: new Date().setFullYear(new Date().getFullYear() - 1),
            ready: false,
        };
    });

    it("should render", () => {
        renderWithRouter(<SubtractionItem {...props} />);
        expect(screen.getByText("Foo")).toBeInTheDocument();
        expect(screen.getByText("testNickname")).toBeInTheDocument();
        expect(screen.getByRole("progressbar")).toHaveAttribute(
            "data-value",
            "50",
        );
    });

    it.each(["waiting", "running", "error"])(
        "should render progress bar for ",
        (state) => {
            props.job.state = state;
            renderWithRouter(<SubtractionItem {...props} />);
            expect(screen.getByRole("progressbar")).toBeInTheDocument();
        },
    );

    it("should not render progress bar if job is ready", () => {
        props.ready = true;
        renderWithRouter(<SubtractionItem {...props} />);
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        expect(screen.queryByText("Complete")).not.toBeInTheDocument();
        expect(screen.getByText("user_handle created")).toBeInTheDocument();
        expect(screen.getByText("1 year ago")).toBeInTheDocument();
    });

    it("should correctly render subtractions where jobs=null", () => {
        props.job = null;
        props.ready = false;
        renderWithRouter(<SubtractionItem {...props} />);
    });
});
