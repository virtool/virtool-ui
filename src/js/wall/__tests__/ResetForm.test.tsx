import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import React from "react";
import { useDispatch } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../tests/setupTests";
import ResetForm from "../ResetForm";

vi.mock("react-redux", () => ({
    useDispatch: vi.fn(),
}));

describe("<ResetForm />", () => {
    let mockDispatch;

    beforeEach(() => {
        mockDispatch = vi.fn();
        (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    });

    it("should call API with correct params and display error message on reset failure", async () => {
        const resetCode = "test_reset_code";
        const password = "P@ssword123";
        const errorMessage = "Invalid reset code";

        const scope = nock("http://localhost")
            .post("/api/account/reset", { password, reset_code: resetCode })
            .reply(400, { message: errorMessage });

        renderWithProviders(<ResetForm resetCode={resetCode} />);

        const passwordField = screen.getByLabelText("Password");
        await userEvent.type(passwordField, password);
        expect(passwordField).toHaveValue(password);

        await userEvent.click(screen.getByRole("button", { name: "Reset" }));

        expect(await screen.findByText(errorMessage)).toBeInTheDocument();

        scope.done();
    });
});
