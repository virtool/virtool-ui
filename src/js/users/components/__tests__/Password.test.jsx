import { Password, mapStateToProps, mapDispatchToProps } from "../Password";
import { editUser } from "../../actions";
import { screen } from "@testing-library/react";
import { attachResizeObserver } from "../../../../tests/setupTests";

describe("<Password />", () => {
    let props;

    beforeEach(() => {
        attachResizeObserver();

        props = {
            id: "bob",
            forceReset: false,
            lastPasswordChange: "2018-02-14T17:12:00.000000Z",
            minimumPasswordLength: 8,
            onSetForceReset: vi.fn(),
            onSubmit: vi.fn()
        };
    });

    it("should render correctly when forceReset = false", () => {
        renderWithProviders(<Password {...props} />);

        expect(screen.getByText("Change Password")).toBeInTheDocument();
        expect(screen.getByText(/Last changed/)).toBeInTheDocument();
        expect(screen.getByText("Force user to reset password on next login")).toBeInTheDocument();
        expect(screen.getByLabelText("password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("should call onSubmit when submitted value long enough", async () => {
        renderWithProviders(<Password {...props} />);

        await userEvent.type(screen.getByLabelText("password"), "newPassword");

        expect(props.onSubmit).not.toHaveBeenCalled();

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(props.onSubmit).toHaveBeenCalledWith("bob", "newPassword");
    });

    it("should not call onSubmit when submitted value too short", async () => {
        renderWithProviders(<Password {...props} />);

        await userEvent.type(screen.getByLabelText("password"), "123");

        expect(props.onSubmit).not.toHaveBeenCalled();

        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        expect(props.onSubmit).not.toHaveBeenCalled();
    });

    it("should call onsetForceReset when checkbox is clicked", async () => {
        renderWithProviders(<Password {...props} />);

        expect(props.onSetForceReset).not.toHaveBeenCalled();

        await userEvent.click(screen.getByLabelText("Force user to reset password on next login"));

        expect(props.onSetForceReset).toHaveBeenCalledTimes(1);
    });
});

describe("mapStateToProps()", () => {
    it("should return mapStateToProps", () => {
        let forceReset, id, lastPasswordChange, minimumPasswordLength;

        const state = {
            settings: {
                data: {
                    minimum_password_length: 2
                }
            },
            users: {
                detail: {
                    force_reset: true,
                    id: "foo",
                    last_password_change: "bar"
                }
            }
        };

        let result = (id, forceReset, lastPasswordChange, minimumPasswordLength);
        result = mapStateToProps(state);
        expect(result).toEqual({
            id: "foo",
            forceReset: true,
            lastPasswordChange: "bar",
            minimumPasswordLength: 2
        });
    });
});

describe("mapDispatchToProps()", () => {
    let dispatch;
    let props;
    beforeEach(() => {
        dispatch = vi.fn();
        props = mapDispatchToProps(dispatch);
    });

    it("should return onSubmit in props", () => {
        const userId = "foo";
        const password = { bar: "baz" };
        props.onSubmit(userId, password);
        expect(dispatch).toHaveBeenCalledWith(editUser(userId, { password }));
    });

    it("should return onSetForceReset in props", () => {
        const userId = "foo";
        const enabled = "bar";
        props.onSetForceReset(userId, enabled);
        expect(dispatch).toHaveBeenCalledWith(editUser(userId, { force_reset: enabled }));
    });
});
