import { shallow } from "enzyme";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InputSelect } from "../../../../base";
import { getCanModifyRights } from "../../../selectors";
import { mapDispatchToProps, mapStateToProps, SampleRights } from "../Rights";

vi.mock("../../../selectors.ts");

describe("<SampleRights />", () => {
    let props;
    const e = {
        target: {
            value: "bar",
        },
    };

    beforeEach(() => {
        props = {
            canModifyRights: true,
            groups: [{ id: "managers" }, { id: "technicians" }],
            sampleId: "foo",
            onListGroups: vi.fn(),
            onChangeRights: vi.fn(),
            onChangeGroup: vi.fn(),
            group_read: true,
            group_write: true,
            all_read: true,
            all_write: true,
        };
    });

    it("should render", () => {
        const wrapper = shallow(<SampleRights {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should call onListGroups after mount", () => {
        shallow(<SampleRights {...props} />);
        expect(props.onListGroups).toHaveBeenCalled();
    });

    it("should call handleChangeGroup() when input is changed", () => {
        const wrapper = shallow(<SampleRights {...props} />);
        wrapper.find(InputSelect).at(0).simulate("change", e);
        expect(props.onChangeGroup).toHaveBeenCalledWith("foo", "bar");
    });

    it("should call handleChangeRights() when input is changed", () => {
        const wrapper = shallow(<SampleRights {...props} />);
        wrapper.find(InputSelect).at(1).simulate("change", e);
        expect(props.onChangeRights).toHaveBeenCalledWith("foo", "group", "bar");
    });

    it("should return LoadingPlaceholder when[this.props.groups=null]", () => {
        props.groups = null;
        const wrapper = shallow(<SampleRights {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should return Not allowed panel when[this.props.canModifyRights=false]", () => {
        props.canModifyRights = false;
        const wrapper = shallow(<SampleRights {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

describe("mapStateToProps()", () => {
    const state = {
        samples: {
            detail: {
                all_read: true,
                all_write: false,
                group: "baz",
                group_read: true,
                group_write: false,
                user: { id: "Baz" },
                id: "Boo",
            },
        },
        account: { id: "foo", administrator: true },
        groups: { documents: "bar" },
    };

    it("should return props when getCanModifyRights returns false", () => {
        getCanModifyRights.mockReturnValue(false);

        const props = mapStateToProps(state);
        expect(props).toEqual({
            accountId: "foo",
            all_read: true,
            all_write: false,
            canModifyRights: false,
            group: "baz",
            group_read: true,
            group_write: false,
            groups: "bar",
            ownerId: "Baz",
            sampleId: "Boo",
        });
    });

    it("should return props when getCanModifyRights returns true", () => {
        getCanModifyRights.mockReturnValue(true);

        const props = mapStateToProps(state);
        expect(props).toEqual({
            accountId: "foo",
            all_read: true,
            all_write: false,
            canModifyRights: true,
            group: "baz",
            group_read: true,
            group_write: false,
            groups: "bar",
            ownerId: "Baz",
            sampleId: "Boo",
        });
    });
});

describe("mapDispatchToProps()", () => {
    const dispatch = vi.fn();

    it("onListGroups() should return listGroups in props", () => {
        const props = mapDispatchToProps(dispatch);
        props.onListGroups();
        expect(dispatch).toHaveBeenCalledWith({
            type: "LIST_GROUPS_REQUESTED",
        });
    });

    it("onChangeGroup() should return updateSampleRights in props", () => {
        const props = mapDispatchToProps(dispatch);
        props.onChangeGroup("foo", "bar");
        expect(dispatch).toHaveBeenNthCalledWith(1, { type: "LIST_GROUPS_REQUESTED" });
        expect(dispatch).toHaveBeenNthCalledWith(2, {
            payload: { sampleId: "foo", update: { group: "bar" } },
            type: "UPDATE_SAMPLE_RIGHTS_REQUESTED",
        });
    });

    it("onChangeRights() should return updateSampleRights in props", () => {
        const props = mapDispatchToProps(dispatch);
        props.onChangeRights("foo", "group", "read");
        expect(dispatch).toHaveBeenNthCalledWith(1, { type: "LIST_GROUPS_REQUESTED" });
        expect(dispatch).toHaveBeenNthCalledWith(2, {
            payload: { sampleId: "foo", update: { group: "bar" } },
            type: "UPDATE_SAMPLE_RIGHTS_REQUESTED",
        });
        expect(dispatch).toHaveBeenNthCalledWith(3, {
            type: "UPDATE_SAMPLE_RIGHTS_REQUESTED",
            payload: {
                sampleId: "foo",
                update: {
                    group_read: true,
                    group_write: false,
                },
            },
        });
    });
});
