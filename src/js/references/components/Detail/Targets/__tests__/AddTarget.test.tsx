import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeReference, mockApiEditReference } from "../../../../../../tests/fake/references";
import { renderWithProviders } from "../../../../../../tests/setupTests";
import AddTarget from "../AddTarget";

describe("<AddTarget />", () => {
    let props;

    beforeEach(() => {
        props = {
            targets: [{ name: "foo", description: "bar", length: 1, required: true }],
            refId: "baz",
            onHide: vi.fn(),
            show: true,
        };
    });

    it("should render", () => {
        renderWithProviders(<AddTarget {...props} />);

        expect(screen.getByText("Add Target")).toBeInTheDocument();
        expect(screen.getByLabelText("Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Description")).toBeInTheDocument();
        expect(screen.getByLabelText("Length")).toBeInTheDocument();
        expect(screen.getByLabelText("Required")).toBeInTheDocument();
    });

    it("should render required when form onClick() prop is called", async () => {
        renderWithProviders(<AddTarget {...props} />);

        expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "unchecked");
        await userEvent.click(screen.getByRole("checkbox"));
        expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "checked");
    });

    it("should render error when submitted without name", async () => {
        renderWithProviders(<AddTarget {...props} />);

        await userEvent.click(screen.getByRole("button"));
        expect(screen.getByText("Required Field")).toBeInTheDocument();
    });

    it("should call onSubmit() and onHide() when submitted", async () => {
        const reference = createFakeReference();
        props.refId = reference.id;
        const scope = mockApiEditReference(reference, {
            targets: [
                {
                    description: "bar",
                    length: 1,
                    name: "foo",
                    required: true,
                },
                {
                    description: "Foo description",
                    length: 10,
                    name: "Foo",
                    required: true,
                },
            ],
        });
        renderWithProviders(<AddTarget {...props} />);

        await userEvent.type(screen.getByLabelText("Name"), "Foo");
        await userEvent.type(screen.getByLabelText("Description"), "Foo description");
        await userEvent.clear(screen.getByLabelText("Length"));
        await userEvent.type(screen.getByLabelText("Length"), "10");
        await userEvent.click(screen.getByRole("checkbox"));
        await userEvent.click(screen.getByRole("button"));

        await waitFor(() => expect(props.onHide).toHaveBeenCalled());
        scope.done();
    });
});
