import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { EmptyReference, mapDispatchToProps } from "../Empty";

describe("<EmptyReference />", () => {
    let props;

    beforeEach(() => {
        props = {
            onSubmit: vi.fn()
        };
    });

    it("should display error and block submission when name textbox is empty", async () => {
        renderWithProviders(<EmptyReference {...props} />);

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(screen.getByText("Required Field")).toBeInTheDocument();
        expect(props.onSubmit).not.toHaveBeenCalled();
    });

    it("handleSubmit should call onSubmit when [name.length!=0] and [dataType.length!=0]", async () => {
        renderWithProviders(<EmptyReference {...props} />);

        await userEvent.type(screen.getByRole("textbox", { name: "Name" }), "test_name");
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(props.onSubmit).toHaveBeenCalled();
    });

    it("handleSubmit should submit correct dataType when changed", async () => {
        renderWithProviders(<EmptyReference {...props} />);

        const name = "test_name";

        await userEvent.type(screen.getByRole("textbox", { name: "Name" }), name);
        await userEvent.click(screen.getByRole("button", { name: "Barcode Target sequences for barcode analysis" }));
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(props.onSubmit).toHaveBeenCalledWith(name, "", "barcode", "");
    });

    it("handleSubmit should call onSubmit when [name.length!=0] and [dataType.length!=0]", async () => {
        renderWithProviders(<EmptyReference {...props} />);

        const name = "test_name";
        const organism = "test_organism";
        const dataType = "genome";
        const description = "test_description";

        await userEvent.type(screen.getByRole("textbox", { name: "Name" }), name);
        await userEvent.type(screen.getByRole("textbox", { name: "Organism" }), organism);
        await userEvent.type(screen.getByRole("textbox", { name: "Description" }), description);
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(props.onSubmit).toHaveBeenCalledWith(name, description, dataType, organism);
    });
});

describe("mapDispatchToProps()", () => {
    const dispatch = vi.fn();
    const props = mapDispatchToProps(dispatch);

    it("should return onSubmit in props", () => {
        props.onSubmit("foo", "bar");
        expect(dispatch).toHaveBeenCalledWith({
            payload: { name: "foo", description: "bar" },
            type: "EMPTY_REFERENCE_REQUESTED"
        });
    });
});
