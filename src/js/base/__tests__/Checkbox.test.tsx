import { Checkbox } from "@base";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setupTests";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Checkbox", () => {
    let props;

    beforeEach(() => {
        props = {
            checked: false,
            disabled: false,
            onClick: vi.fn(),
            label: "foo",
        };
    });

    it("should render correctly when checked = false", () => {
        renderWithProviders(<Checkbox {...props} />);

        const checkbox = screen.getByRole("checkbox", { name: "foo" });
        expect(checkbox).toBeInTheDocument();
        expect(screen.getByText("foo")).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
    });

    it("should render correctly when checked = true", () => {
        props.checked = true;

        renderWithProviders(<Checkbox {...props} />);

        const checkbox = screen.getByRole("checkbox", { name: "foo" });
        expect(checkbox).toBeInTheDocument();
        expect(screen.getByText("foo")).toBeInTheDocument();
        expect(checkbox).toBeChecked();
    });

    it("should render correctly with no label", () => {
        props.label = "";

        renderWithProviders(<Checkbox {...props} />);

        const checkbox = screen.getByRole("checkbox", { name: "checkbox" });
        expect(checkbox).toBeInTheDocument();
        expect(screen.queryByRole("checkbox", { name: "foo" })).not.toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
    });

    it("should call onClick when checkbox clicked", async () => {
        renderWithProviders(<Checkbox {...props} />);

        expect(props.onClick).not.toHaveBeenCalled();

        await userEvent.click(screen.getByRole("checkbox", { name: "foo" }));

        expect(props.onClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when disabled = true", async () => {
        props.disabled = true;

        renderWithProviders(<Checkbox {...props} />);

        expect(props.onClick).not.toHaveBeenCalled();

        await userEvent.click(screen.getByRole("checkbox", { name: "foo" }));

        expect(props.onClick).not.toHaveBeenCalled();
    });
});
