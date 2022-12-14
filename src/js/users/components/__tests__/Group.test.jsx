import { UserGroup } from "../Group";
import { screen } from "@testing-library/react";

describe("<UserGroup />", () => {
    let props;

    beforeEach(() => {
        props = {
            id: "3691nwak3",
            name: "bob",
            toggled: true,
            onClick: vi.fn()
        };
    });

    it("should render correctly when toggled=true", () => {
        renderWithProviders(<UserGroup {...props} />);

        expect(screen.getByText("bob")).toBeInTheDocument();
        expect(screen.queryByText("3691nwak3")).not.toBeInTheDocument();
    });

    it("should render with [toggled=false]", () => {
        props.toggled = false;

        renderWithProviders(<UserGroup {...props} />);

        expect(screen.getByText("bob")).toBeInTheDocument();
        expect(screen.queryByText("3691nwak3")).not.toBeInTheDocument();
    });

    it("should call [onClick] when clicked", async () => {
        renderWithProviders(<UserGroup {...props} />);

        expect(props.onClick).not.toHaveBeenCalled();

        await userEvent.click(screen.getByText("bob"));

        expect(props.onClick).toHaveBeenCalled();
    });
});
