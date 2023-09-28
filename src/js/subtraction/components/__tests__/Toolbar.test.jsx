import { shallow } from "enzyme";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkAdminRoleOrPermission } from "../../../administration/utils";
import { FIND_SUBTRACTIONS } from "../../../app/actionTypes";
import { InputSearch } from "../../../base";
import { mapDispatchToProps, mapStateToProps, SubtractionToolbar } from "../Toolbar";

vi.mock("../../../administration/utils.ts");

describe("<SubtractionToolbar />", () => {
    let props;

    beforeEach(() => {
        props = {
            canModify: true,
            onFind: vi.fn(),
        };
    });

    it("should render create button when [canModify=true]", () => {
        const wrapper = shallow(<SubtractionToolbar {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should not render create button when [canModify=false]", () => {
        props.canModify = false;
        const wrapper = shallow(<SubtractionToolbar {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should call onFind() when SearchInput changes", () => {
        const wrapper = shallow(<SubtractionToolbar {...props} />);
        const term = {
            target: {
                value: "Foo",
            },
        };
        wrapper.find(InputSearch).simulate("change", term);
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
            payload: { term },
        });
    });
});
