import { shallow } from "enzyme";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InputSearch } from "../../../base";
import { SampleSearchToolbar } from "../Toolbar";

describe("<SampleSearchToolbar />", () => {
    let props;

    beforeEach(() => {
        props = {
            canCreate: true,
            initialTerm: "foo",
            onFind: vi.fn(),
        };
    });

    it.each([true, false])("should render when [canCreate=%p]", canCreate => {
        props.canCreate = canCreate;
        const wrapper = shallow(<SampleSearchToolbar {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should call onFind() when input changes", () => {
        const wrapper = shallow(<SampleSearchToolbar {...props} />);
        const e = { target: { value: "foo" } };

        wrapper.find(InputSearch).simulate("change", e);

        expect(props.onFind).toHaveBeenCalledWith("foo");
    });
});
