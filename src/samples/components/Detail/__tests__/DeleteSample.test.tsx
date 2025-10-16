import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiRemoveSample } from "@tests/fake/samples";
import { renderWithRouter } from "@tests/setup";
import { beforeEach, describe, expect, it } from "vitest";
import DeleteSample from "../DeleteSample";

describe("<DeleteSample />", () => {
    let props;

    beforeEach(() => {
        props = {
            id: "foo",
            name: "test",
            ready: true,
        };
    });

    it("renders delete button when sample is ready", () => {
        renderWithRouter(<DeleteSample {...props} />);

        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders delete button when sample has failed job", () => {
        renderWithRouter(
            <DeleteSample {...props} ready={false} job={{ state: "error" }} />,
        );

        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("does not render when sample has running job", () => {
        renderWithRouter(
            <DeleteSample {...props} ready={false} job={{ state: "running" }} />,
        );

        expect(screen.queryByRole("button")).toBeNull();
    });

    it("should handle submit when confirm button is clicked", async () => {
        const scope = mockApiRemoveSample(props.id);
        renderWithRouter(<DeleteSample {...props} />);

        await userEvent.click(screen.getByRole("button"));
        expect(screen.getByText("Delete Sample")).toBeInTheDocument();

        await userEvent.click(screen.getByText("Confirm"));

        scope.done();
    });
});
