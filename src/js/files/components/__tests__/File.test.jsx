import { shallow } from "enzyme";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkAdminRoleOrPermission } from "../../../administration/utils";
import { REMOVE_FILE } from "../../../app/actionTypes";
import { File, mapDispatchToProps, mapStateToProps } from "../File";

vi.mock("../../../administration/utils.ts");

describe("<File />", () => {
    let props;

    beforeEach(() => {
        props = {
            canRemove: true,
            id: "foo",
            name: "foo.fa",
            size: 10,
            uploadedAt: "2018-02-14T17:12:00.000000Z",
            user: { id: "bill", handle: "bill" },
            ready: true,
            onRemove: vi.fn(),
        };
    });

    it("should render", () => {
        const wrapper = shallow(<File {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when [ready=false]", () => {
        props.ready = false;
        const wrapper = shallow(<File {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when [user=null]", () => {
        props.user = null;
        const wrapper = shallow(<File {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when [canRemove=false]", () => {
        props.canRemove = false;
        const wrapper = shallow(<File {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should have [props.onRemove] called when trash icon clicked", () => {
        const wrapper = shallow(<File {...props} />);
        wrapper.find("Icon").simulate("click");
        expect(props.onRemove).toHaveBeenCalledWith("foo");
    });
});

describe("mapStateToProps()", () => {
    let ownProps;
    let state;

    beforeEach(() => {
        ownProps = { id: "foo" };
        state = {
            files: {
                items: [
                    {
                        id: "foo",
                        name: "Foo",
                        user: { id: "bob" },
                        ready: true,
                        reserved: false,
                        size: 1024,
                        uploaded_at: "time_1",
                    },
                    {
                        id: "bar",
                        name: "Bar",
                        user: { id: "bill" },
                        ready: true,
                        reserved: false,
                        size: 2048,
                        uploaded_at: "time_2",
                    },
                ],
            },
        };
    });

    it.each([true, false])("should return expected props when [canRemove=%p]", canRemove => {
        checkAdminRoleOrPermission.mockReturnValue(canRemove);

        const props = mapStateToProps(state, ownProps);

        expect(props).toEqual({
            canRemove,
            id: "foo",
            name: "Foo",
            size: 1024,
            ready: true,
            uploadedAt: "time_1",
            user: { id: "bob" },
        });
        expect(checkAdminRoleOrPermission).toHaveBeenCalledWith(state, "remove_file");
    });
});

describe("mapDispatchToProps", () => {
    it("should return functional [props.onRemove]", () => {
        const dispatch = vi.fn();
        const props = mapDispatchToProps(dispatch);
        props.onRemove("foo");
        expect(dispatch).toHaveBeenCalledWith({
            type: REMOVE_FILE.REQUESTED,
            payload: { fileId: "foo" },
        });
    });
});
