import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mapDispatchToProps, mapStateToProps, PrimaryGroup } from "../PrimaryGroup";

describe("<PrimaryGroup />", () => {
    const props = {
        groups: [
            { id: "1", name: "foo" },
            { id: "2", name: "bar" },
            { id: "3", name: "baz" }
        ],
        id: "bob",
        primaryGroup: { id: "2", name: "bar" },
        onSetPrimaryGroup: vi.fn()
    };

    it("should render", () => {
        renderWithProviders(<PrimaryGroup {...props} />);
        expect(screen.getByText("Primary Group")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toHaveValue("2");
        expect(screen.getByText("Bar")).toBeInTheDocument();
    });

    it("should render when [primaryGroup = null]", () => {
        props.primaryGroup = null;
        renderWithProviders(<PrimaryGroup {...props} />);
        expect(screen.getByText("Primary Group")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toHaveValue("none");
    });

    it("should call onSetPrimaryGroup() when selection changes", async () => {
        props.primaryGroup = "3";
        renderWithProviders(<PrimaryGroup {...props} />);
        expect(screen.getByText("Primary Group")).toBeInTheDocument();
        userEvent.selectOptions(screen.getByRole("combobox"), "Bar");
        userEvent.selectOptions(screen.getByRole("combobox"), "none");
        await waitFor(() => {
            expect(props.onSetPrimaryGroup).toHaveBeenNthCalledWith(1, "bob", "2");
            expect(props.onSetPrimaryGroup).toHaveBeenNthCalledWith(2, "bob", null);
        });
    });
});

describe("mapStateToProps", () => {
    const groups = ["foo", "bar", "baz"];
    const state = {
        users: {
            detail: { id: "bob", groups, primary_group: "bar" }
        }
    };
    it("should return props", () => {
        const result = mapStateToProps(state);
        expect(result).toEqual({
            id: "bob",
            groups,
            primaryGroup: "bar"
        });
    });
});

describe("mapDispatchToProps", () => {
    it("should return onSetPrimaryGroup() in props", () => {
        const dispatch = vi.fn();
        const props = mapDispatchToProps(dispatch);

        props.onSetPrimaryGroup("foo", "bar");

        expect(dispatch).toHaveBeenCalledWith({
            type: "EDIT_USER_REQUESTED",
            payload: {
                update: {
                    primary_group: "bar"
                },
                userId: "foo"
            }
        });
    });
});
