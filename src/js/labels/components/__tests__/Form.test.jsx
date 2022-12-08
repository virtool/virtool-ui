import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import React from "react";
import { LabelForm } from "../Form";

describe("<LabelForm />", () => {
    let props;

    beforeEach(() => {
        props = {
            color: "#9F7AEA",
            description: "This is a test label",
            errorColor: "",
            errorName: "",
            name: "Foo",
            onChange: vi.fn(),
            onColorChange: vi.fn(),
            onSubmit: vi.fn()
        };
    });

    it("should render with prefilled fields", () => {
        renderWithProviders(<LabelForm {...props} />);
        expect(screen.getByLabelText("Name")).toHaveValue(props.name);
    });

    it("should call onChange() when fields change", async () => {
        renderWithProviders(<LabelForm {...props} />);

        await userEvent.type(screen.getByLabelText("Name"), "B");
        expect(props.onChange).toHaveBeenCalledWith("name", "FooB");

        await userEvent.type(screen.getByLabelText("Description"), "A");
        expect(props.onChange).toHaveBeenCalledWith("description", "This is a test labelA");
    });

    it("should call onSubmit() when save button clicked", async () => {
        renderWithProviders(<LabelForm {...props} />);

        expect(props.onSubmit).not.toHaveBeenCalled();

        await userEvent.click(screen.getByRole("button", { name: "Save" }));
        expect(props.onSubmit).toHaveBeenCalled();
    });
});
