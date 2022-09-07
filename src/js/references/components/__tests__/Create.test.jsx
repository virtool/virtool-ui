import { EmptyReference, mapDispatchToProps } from "../Empty";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

describe("<EmptyReference />", () => {
    let props;

    let initialValues;

    beforeEach(() => {
        props = {
            onSubmit: vi.fn()
        };
        initialValues = {
            name: "",
            description: "",
            dataType: "genome",
            organism: "",
            mode: "empty"
        };
    });

    it("should render", () => {
        renderWithProviders(<EmptyReference {...props} />);
        expect(screen.getByText("Create an empty reference.")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(initialValues.name);
        expect(screen.getByText("Description")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Description" })).toHaveValue(initialValues.description);
        expect(screen.getByText("Organism")).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: "Organism" })).toHaveValue(initialValues.organism);
    });

    it("Should display error and block submission when name textbox is empty", async () => {
        renderWithProviders(<EmptyReference {...props} />);
        userEvent.click(screen.getByRole("button", { name: "Save" }));
        await waitFor(() => expect(screen.getByText("Required Field")).toBeInTheDocument());
        expect(props.onSubmit).not.toHaveBeenCalled();
    });

    it("handleSubmit should call onSubmit when [name.length!=0] and [dataType.length!=0]", async () => {
        renderWithProviders(<EmptyReference {...props} />);
        userEvent.type(screen.getByRole("textbox", { name: "Name" }), "test_name");
        userEvent.click(screen.getByRole("button", { name: "Save" }));
        await waitFor(() => expect(props.onSubmit).toHaveBeenCalled());
    });

    it("handleSubmit should submit correct dataType when Changed", async () => {
        renderWithProviders(<EmptyReference {...props} />);
        const expectedOutput = {
            name: "test_name",
            organism: "",
            dataType: "barcode",
            description: ""
        };
        const { name, organism, dataType, description } = expectedOutput;
        userEvent.type(screen.getByRole("textbox", { name: "Name" }), name);
        userEvent.click(screen.getByRole("button", { name: "Barcode Target sequences for barcode analysis" }));
        userEvent.click(screen.getByRole("button", { name: "Save" }));
        await waitFor(() => expect(props.onSubmit).toHaveBeenCalledWith(name, organism, dataType, description));
    });

    it("handleSubmit should call onSubmit when [name.length!=0] and [dataType.length!=0]", async () => {
        renderWithProviders(<EmptyReference {...props} />);
        const expectedOutput = {
            name: "test_name",
            organism: "test_organism",
            dataType: initialValues.dataType,
            description: "test_description"
        };
        const { name, organism, description, dataType } = expectedOutput;

        userEvent.type(screen.getByRole("textbox", { name: "Name" }), name);
        userEvent.type(screen.getByRole("textbox", { name: "Organism" }), organism);
        userEvent.type(screen.getByRole("textbox", { name: "Description" }), description);

        userEvent.click(screen.getByRole("button", { name: "Save" }));

        await waitFor(() => expect(props.onSubmit).toHaveBeenCalledWith(name, description, dataType, organism));
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
