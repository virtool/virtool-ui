import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RESET_PASSWORD } from "../../app/actionTypes";
import { mapDispatchToProps, mapStateToProps, Reset } from "../Reset";
import { vi } from "vitest";

describe("<Reset />", () => {
    let props;
    beforeEach(() => {
        props = {
            error: "",
            resetCode: "test_reset_code",
            onReset: vi.fn()
        };
    });

    it("should render", () => {
        renderWithProviders(<Reset {...props} />);
        expect(screen.getByText("Password Reset")).toBeInTheDocument();
        expect(screen.getByText("You are required to set a new password before proceeding.")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
    });

    it("should render filled password field", () => {
        renderWithProviders(<Reset {...props} />);
        userEvent.type(screen.getByLabelText("Password"), `Password`);
        expect(screen.getByLabelText("Password")).toHaveValue(`Password`);
    });

    it("should call onReset with correct parameters", async () => {
        renderWithProviders(<Reset {...props} />);
        const testPassword = "test_password";
        userEvent.type(screen.getByLabelText("Password"), testPassword);
        expect(screen.getByLabelText("Password")).toHaveValue(testPassword);
        userEvent.click(screen.getByRole("button", { name: "Reset" }));
        await waitFor(() => expect(props.onReset).toHaveBeenCalledWith("test_password", "test_reset_code"));
    });
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
