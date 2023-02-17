import React from "react";
import { CloneReference, mapDispatchToProps, mapStateToProps } from "../Clone";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";

describe("<CloneReference />", () => {
    const props = {
        refId: "foo",
        refDocuments: [
            {
                id: "foo",
                data_type: "genome",
                organism: "foo_organism",
                name: "foo_name",
                otu_count: 5,
                user: { id: "foo_user_id", handle: "foo_user_handle" },
                created_at: "2019-02-10T17:11:00.000000Z"
            }
        ],
        show: true,
        onSubmit: vi.fn(),
        onHide: vi.fn()
    };

    it("should render", () => {
        renderWithProviders(<CloneReference {...props} />);

        expect(screen.getByText("Clone Reference")).toBeInTheDocument();
        expect(screen.getByText("5 OTUs")).toBeInTheDocument();
        expect(screen.getByText("foo_name")).toBeInTheDocument();
        expect(screen.getByText(/foo_user_handle.+created/)).toBeInTheDocument();
        expect(screen.getByText("4 years ago")).toBeInTheDocument();
        expect(screen.getByRole("textbox")).toHaveValue("Clone of foo_name");
        expect(screen.getByRole("button", { name: "Clone" })).toBeInTheDocument();
    });

    it("should display an error when name input is cleared", async () => {
        renderWithProviders(<CloneReference {...props} />);

        await userEvent.clear(screen.getByRole("textbox"));
        await userEvent.click(screen.getByRole("button", { name: "Clone" }));

        expect(screen.getByText("Required Field")).toBeInTheDocument();
    });
    it("handleSubmit() should call not call onSubmit when error is present", async () => {
        renderWithProviders(<CloneReference {...props} />);

        await userEvent.clear(screen.getByRole("textbox"));
        await userEvent.click(screen.getByRole("button", { name: "Clone" }));

        expect(screen.getByText("Required Field")).toBeInTheDocument();
        expect(props.onSubmit).not.toBeCalled();
    });

    it("handleSubmit() should call onSubmit with correct input", async () => {
        renderWithProviders(<CloneReference {...props} />);

        await userEvent.click(screen.getByRole("button", { name: "Clone" }));

        const reference = props.refDocuments[0];

        expect(props.onSubmit).toBeCalledWith(
            `Clone of ${reference.name}`,
            `Cloned from ${reference.name}`,
            reference.id
        );
    });

    it("handleSubmit() should call onSubmit with changed input", async () => {
        renderWithProviders(<CloneReference {...props} />);

        const name = "newName";

        await userEvent.clear(screen.getByRole("textbox"));
        await userEvent.type(screen.getByRole("textbox"), name);
        await userEvent.click(screen.getByRole("button", { name: "Clone" }));

        const reference = props.refDocuments[0];

        await waitFor(() => expect(props.onSubmit).toBeCalledWith(name, `Cloned from ${reference.name}`, reference.id));
    });
});

describe("mapStateToProps()", () => {
    it("should return props", () => {
        const state = {
            router: {
                location: {
                    state: {
                        id: "foo",
                        cloneReference: true
                    }
                }
            },
            references: { documents: "bar" }
        };
        const result = mapStateToProps(state);
        expect(result).toEqual({
            refId: "foo",
            refDocuments: "bar",
            show: true
        });
    });
});

describe("mapDispatchToProps()", () => {
    const dispatch = vi.fn();
    const props = mapDispatchToProps(dispatch);

    it("should return onSubmit in props", () => {
        props.onSubmit("foo", "bar", "boo");
        expect(dispatch).toHaveBeenCalledWith({
            payload: { name: "foo", description: "bar", refId: "boo" },
            type: "CLONE_REFERENCE_REQUESTED"
        });
    });
    it("should return onHide in props", () => {
        props.onHide();
        expect(dispatch).toHaveBeenCalledWith({ payload: { state: { cloneReference: false } }, type: "PUSH_STATE" });
    });
});
