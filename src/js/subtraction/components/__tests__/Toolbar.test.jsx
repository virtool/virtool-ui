import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "../../../../tests/setupTests";
import { checkAdminRoleOrPermission } from "../../../administration/utils";
import { FIND_SUBTRACTIONS } from "../../../app/actionTypes";
import { mapDispatchToProps, mapStateToProps, SubtractionToolbar } from "../Toolbar";

vi.mock("../../../administration/utils.ts");

describe("<SubtractionToolbar />", () => {
    let props;
    let history;

    beforeEach(() => {
        props = {
            canModify: true,
            onFind: vi.fn(),
        };
        history = createBrowserHistory();
    });

    it("should render create button when [canModify=true]", () => {
        renderWithRouter(<SubtractionToolbar {...props} />, {}, history);

        const createButton = screen.getByLabelText("plus-square");
        expect(createButton).toBeInTheDocument();
    });

    it("should not render create button when [canModify=false]", () => {
        props.canModify = false;
        renderWithRouter(<SubtractionToolbar {...props} />, {}, history);

        const createButton = screen.queryByLabelText("plus-square");
        expect(createButton).toBeNull();
    });

    it("should call onFind() when SearchInput changes", async () => {
        const searchInput = "Foo";

        renderWithRouter(<SubtractionToolbar {...props} />, {}, history);

        const inputElement = screen.getByPlaceholderText("Name");
        expect(inputElement).toHaveValue("");

        await userEvent.type(inputElement, searchInput);
        expect(inputElement).toHaveValue(searchInput);

        fireEvent.change(inputElement, { target: { value: "Foo" } });
        expect(props.onFind).toHaveBeenCalledWith("Foo");
    });
});

describe("mapStateToProps()", () => {
    let state;

    it.each([true, false])("should return props when [canModify=%p]", canModify => {
        checkAdminRoleOrPermission.mockReturnValue(canModify);

        const props = mapStateToProps(state);
        expect(props).toEqual({
            canModify,
        });
    });
});

describe("mapDispatchToProps()", () => {
    it.each(["Foo", ""])("should return onFind() in props that takes [value=%p]", value => {
        const dispatch = vi.fn();
        const props = mapDispatchToProps(dispatch);
        const term = { target: { value } };
        props.onFind(term);

        expect(dispatch).toHaveBeenCalledWith({
            type: FIND_SUBTRACTIONS.REQUESTED,
            payload: { term, page: 1 },
        });
    });
});
