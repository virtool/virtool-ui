import { ServerJobState } from "@/jobs/types";
import { SubtractionMinimal } from "@/subtraction/types";
import { createFakeUserNested } from "@/tests/fake/user";
import { screen } from "@testing-library/react";
import { renderWithRouter } from "@tests/setup";
import { beforeEach, describe, expect, it } from "vitest";
import { SubtractionItem } from "../SubtractionItem";

describe("<SubtractionItem />", () => {
    let props: SubtractionMinimal | undefined;

    beforeEach(() => {
        const createdAt = new Date();

        createdAt.setFullYear(new Date().getFullYear() - 1);

        props = {
            id: "foo",
            created_at: createdAt.toISOString(),
            file: {
                id: 23,
                name: "subtraction.fa.gz",
            },
            job: {
                id: "foobar",
                created_at: createdAt.toISOString(),
                progress: 50,
                stage: "Build Index",
                state: "running",
                workflow: "create_subtraction",
                user: createFakeUserNested(),
            },
            name: "Arabidopsis thaliana",
            nickname: "Thale cress",
            ready: false,
            user: createFakeUserNested(),
        };
    });

    it("should render", () => {
        renderWithRouter(<SubtractionItem {...props} />);

        expect(screen.getByText("Arabidopsis thaliana")).toBeInTheDocument();
        expect(screen.getByText("Thale cress")).toBeInTheDocument();
        expect(screen.getByRole("progressbar")).toHaveAttribute(
            "data-value",
            "50",
        );
    });

    it.each(["waiting", "running", "error"])(
        "should render progress bar for ",
        (state: ServerJobState) => {
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
        expect(
            screen.getByText(`${props.user.handle} created`),
        ).toBeInTheDocument();
        expect(screen.getByText("1 year ago")).toBeInTheDocument();
    });

    it("should correctly render subtractions where jobs=null", () => {
        props.job = null;
        props.ready = false;

        renderWithRouter(<SubtractionItem {...props} />);
    });
});
