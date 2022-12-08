import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RESET_PASSWORD } from "../../app/actionTypes";
import { mapDispatchToProps, mapStateToProps, Reset } from "../Reset";
import { vi } from "vitest";

test("<Reset />", async () => {
    const onReset = vi.fn();

    renderWithProviders(<Reset error="" resetCode="test_reset_code" onReset={onReset} />);
    const field = screen.getByLabelText("Password");

    await userEvent.type(field, "P@ssword123");
    expect(field).toHaveValue("P@ssword123");

    await userEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(onReset).toHaveBeenCalledWith("P@ssword123", "test_reset_code");
});

describe("mapStateToProps()", () => {
    it("should return props given state", () => {
        const state = {
            app: { resetCode: "test_reset_code" },
            errors: { RESET_ERROR: { message: "test_reset_error" } }
        };
        const result = mapStateToProps(state);
        expect(result).toEqual({ resetCode: state.app.resetCode, error: state.errors.RESET_ERROR.message });
    });
});

describe("mapDispatchToProps()", () => {
    it("should return props with valid onLogin()", () => {
        const dispatch = vi.fn();
        const props = mapDispatchToProps(dispatch);

        const payload = { password: "test_password", resetCode: "test_resetCode" };
        const { password, resetCode } = payload;

        props.onReset(password, resetCode);
        expect(dispatch).toHaveBeenCalledWith({
            type: RESET_PASSWORD.REQUESTED,
            payload
        });
    });
});
