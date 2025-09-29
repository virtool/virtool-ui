import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import nock from "nock";
import { describe, expect, it } from "vitest";
import ResetForm from "../ResetForm";

describe("<ResetForm />", () => {
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
