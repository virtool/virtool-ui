import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { useDispatch } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../tests/setupTests";
import { LoginForm } from "../LoginForm";
import { useLoginMutation } from "../Queries";

vi.mock("../Queries", () => ({
    useLoginMutation: vi.fn(),
}));

vi.mock("react-redux", () => ({
    useDispatch: vi.fn(),
}));

describe("<LoginForm />", () => {
    let mockLoginMutation;
    let mockDispatch;

    beforeEach(() => {
        mockDispatch = vi.fn();
        (useDispatch as jest.Mock).mockReturnValue(mockDispatch);

        mockLoginMutation = {
            mutate: vi.fn(),
            isError: false,
        };
        (useLoginMutation as jest.Mock).mockReturnValue(mockLoginMutation);

        window.virtool = {
            b2c: {
                use: false,
            },
        };
    });

    it("should call mutate() with correct values when submitted", async () => {
        renderWithProviders(<LoginForm error="" />);

        const usernameField = screen.getByLabelText("Username");
        await userEvent.type(usernameField, "test_Username");
        expect(usernameField).toHaveValue("test_Username");

        const passwordField = screen.getByLabelText("Password");
        await userEvent.type(passwordField, "Password");
        expect(passwordField).toHaveValue("Password");

        expect(screen.getByLabelText("Remember Me")).toHaveAttribute("data-state", "unchecked");
        await userEvent.click(screen.getByLabelText("Remember Me"));
        expect(screen.getByLabelText("Remember Me")).toHaveAttribute("data-state", "checked");

        await userEvent.click(screen.getByRole("button", { name: "Login" }));
        await waitFor(() =>
            expect(mockLoginMutation.mutate).toHaveBeenCalledWith(
                { username: "test_Username", password: "Password", remember: true },
                expect.any(Object),
            ),
        );
    });

    it("should display error message on login failure", async () => {
        mockLoginMutation.isError = true;

        renderWithProviders(<LoginForm error="Invalid username or password" />);

        await userEvent.type(screen.getByLabelText("Username"), "test_Username");
        await userEvent.type(screen.getByLabelText("Password"), "Password");
        await userEvent.click(screen.getByRole("button", { name: "Login" }));

        await waitFor(() => expect(screen.getByText("Invalid username or password")).toBeInTheDocument());
    });
});
