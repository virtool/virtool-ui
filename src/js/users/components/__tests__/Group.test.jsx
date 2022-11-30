import { UserGroup } from "../Group";
import React from "react";
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
        const group = screen.getByText("bob");
        expect(group).toBeInTheDocument();
        expect(screen.queryByText("3691nwak3")).not.toBeInTheDocument();
    });

    it("should render with [toggled=false]", () => {
        props.toggled = false;
        renderWithProviders(<UserGroup {...props} />);
        const group = screen.getByText("bob");
        expect(group).toBeInTheDocument();
        expect(screen.queryByText("3691nwak3")).not.toBeInTheDocument();
    });

    it("should call [onClick] when clicked", () => {
        renderWithProviders(<UserGroup {...props} />);
        const group = screen.getByText("bob");
        expect(props.onClick).toHaveBeenCalledTimes(0);
        group.click();
        expect(props.onClick).toHaveBeenCalledTimes(1);
    });
});
