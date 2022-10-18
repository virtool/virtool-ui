import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FirstUser, mapDispatchToProps } from "../FirstUser";
import { vi } from "vitest";

describe("<FirstUser />", () => {
    let props;
    let errorMessages;

    beforeEach(() => {
        errorMessages = {
            errors: {
                generalError: "General Error",
                usernameErrors: ["Password Error 1", "Password Error 2"],
                passwordErrors: ["Username Error 1", "Username Error 2"]
            }
        };
        props = {
            onSubmit: vi.fn(),
            ...errorMessages
        };
    });

    it("should render", () => {
        renderWithProviders(<FirstUser {...props} />);
        expect(screen.getByText("Setup Initial User")).toBeInTheDocument();
        expect(screen.getByText("Create an initial administrative user to start using Virtool.")).toBeInTheDocument();
        expect(screen.getByRole("textbox", "username")).toBeInTheDocument();
        expect(screen.getByRole("textbox", "password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Create User" })).toBeInTheDocument();
    });

    it.each(["username", "password"])("should render when %p changed", name => {
        const value = name === "username" ? "bob" : "password";

        renderWithProviders(<FirstUser {...props} />);

        userEvent.type(screen.getByRole("textbox", name), value);
        expect(screen.getByRole("textbox", name).value).toBe(value);
    });

    it("should call onSubmit when form is submitted", async () => {
        props = {
            onSubmit: vi.fn(),
            ...errorMessages
        };
        const usernameInput = "Username";
        const passwordInput = "Password";

        renderWithProviders(<FirstUser {...props} />);

        userEvent.type(screen.getByRole("textbox", /username/i), usernameInput);
        userEvent.type(screen.getByRole("textbox", /password/i), passwordInput);
        userEvent.click(screen.getByRole("button", { name: /Create User/i }));

        // Await must be used to allow the Formik component to call onSubmit asynchronously
        await waitFor(() =>
            expect(props.onSubmit).toHaveBeenCalledWith(usernameInput + passwordInput, expect.anything())
        );
    });
});

describe("mapDispatchToProps", () => {
    it("should return onSubmit() on props", () => {
        const dispatch = vi.fn();
        const props = mapDispatchToProps(dispatch);

        props.onSubmit("foo", "bar");

        expect(dispatch).toHaveBeenCalledWith({
            payload: { handle: "foo", password: "bar" },
            type: "CREATE_FIRST_USER_REQUESTED"
        });
    });
});
