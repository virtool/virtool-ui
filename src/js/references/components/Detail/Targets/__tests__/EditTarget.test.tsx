import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeReference, mockApiEditReference } from "../../../../../../tests/fake/references";
import EditTarget from "../EditTarget";

describe("<EditTarget />", () => {
    const reference = createFakeReference();
    let props;

    beforeEach(() => {
        props = {
            refId: reference.id,
            onHide: vi.fn(),
            show: true,
            targets: reference.targets,
            target: reference.targets[0],
        };
    });

    it("should render", () => {
        renderWithProviders(<EditTarget {...props} />);

        expect(screen.getByText("Edit Target")).toBeInTheDocument();
        expect(screen.getByLabelText("Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Description")).toBeInTheDocument();
        expect(screen.getByLabelText("Length")).toBeInTheDocument();
        expect(screen.getByLabelText("Required")).toBeInTheDocument();
    });

    it("should render error when submitted without name", async () => {
        renderWithProviders(<EditTarget {...props} />);

        await userEvent.clear(screen.getByLabelText("Name"));
        await userEvent.click(screen.getByRole("button"));

        expect(screen.getByText("Required Field")).toBeInTheDocument();
        expect(props.onHide).not.toHaveBeenCalled();
    });

    it("should should call onSubmit() when name provided", async () => {
        const scope = mockApiEditReference(reference, {
            targets: [
                {
                    description: "Foo description",
                    length: 10,
                    name: "Foo",
                    required: reference.targets[0].required,
                },
            ],
        });
        renderWithProviders(<EditTarget {...props} />);

        await userEvent.clear(screen.getByLabelText("Name"));
        await userEvent.type(screen.getByLabelText("Name"), "Foo");
        await userEvent.clear(screen.getByLabelText("Description"));
        await userEvent.type(screen.getByLabelText("Description"), "Foo description");
        await userEvent.clear(screen.getByLabelText("Length"));
        await userEvent.type(screen.getByLabelText("Length"), "10");
        await userEvent.click(screen.getByRole("button"));

        await waitFor(() => expect(props.onHide).toHaveBeenCalled());
        scope.done();
    });

    it("should set initial state on open", () => {
        renderWithProviders(<EditTarget {...props} />);

        expect(screen.getByLabelText("Name")).toHaveValue(props.target.name);
        expect(screen.getByLabelText("Description")).toHaveValue(props.target.description);
        expect(screen.getByLabelText("Length")).toHaveValue(props.target.length);
        expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "checked");
    });
});
