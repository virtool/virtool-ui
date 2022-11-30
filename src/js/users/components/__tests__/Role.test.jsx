import { getCanModifyUser } from "../../selectors";
import { UserRole, mapStateToProps } from "../Role";
import { screen } from "@testing-library/react";

vi.mock("../../selectors.js");

describe("<UserRole />", () => {
    let props;

    beforeEach(() => {
        props = {
            canModifyUser: true,
            id: "bob",
            role: "administrator",
            onSetUserRole: vi.fn()
        };
    });

    it("should render correctly when role = administrator", () => {
        renderWithProviders(<UserRole {...props} />);
        expect(screen.getByText("User Role")).toBeInTheDocument();
        expect(screen.getByText("Administrator")).toBeInTheDocument();
        expect(screen.getByText("Limited")).toBeInTheDocument();
        const options = screen.getAllByRole("option");
        expect(options[0].selected).toBeTruthy();
        expect(options[1].selected).not.toBeTruthy();
    });

    it("should render correctly when role = limited", () => {
        props.role = "limited";
        renderWithProviders(<UserRole {...props} />);
        expect(screen.getByText("User Role")).toBeInTheDocument();
        expect(screen.getByText("Administrator")).toBeInTheDocument();
        expect(screen.getByText("Limited")).toBeInTheDocument();
        const options = screen.getAllByRole("option");
        expect(options[0].selected).not.toBeTruthy();
        expect(options[1].selected).toBeTruthy();
    });

    it("should render empty when canModifyUser = false", () => {
        props.canModifyUser = false;
        renderWithProviders(<UserRole {...props} />);
        expect(screen.queryByText("User Role")).not.toBeInTheDocument();
        expect(screen.queryByText("Administrator")).not.toBeInTheDocument();
        expect(screen.queryByText("Limited")).not.toBeInTheDocument();
    });
});

describe("mapStateToProps()", () => {
    let state;

    beforeEach(() => {
        state = {
            users: {
                detail: {
                    administrator: true,
                    id: "bob"
                }
            }
        };
    });

    it.each([true, false])("should return props when [administrator=%p]", administrator => {
        state.users.detail.administrator = administrator;
        getCanModifyUser.mockReturnValue(true);
        const props = mapStateToProps(state);
        expect(props).toEqual({
            canModifyUser: true,
            id: "bob",
            role: administrator ? "administrator" : "limited"
        });
    });

    it.each([true, false])("should return props when [canModifyUser=%p]", canModifyUser => {
        getCanModifyUser.mockReturnValue(canModifyUser);
        const props = mapStateToProps(state);
        expect(props).toEqual({
            canModifyUser,
            id: "bob",
            role: "administrator"
        });
    });
});
