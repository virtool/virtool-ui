import { shallow } from "enzyme";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InputSearch } from "../../../base";
import { ReferenceToolbar } from "../ReferenceToolbar";

describe("<ReferenceToolbar />", () => {
    let props;

    beforeEach(() => {
        props = {
            canCreate: true,
            term: "",
            onFind: vi.fn(),
        };
    });

    it("should render creation button when [canCreate=true]", () => {
        const wrapper = shallow(<ReferenceToolbar {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should not render creation button when [canCreate=false]", () => {
        props.canCreate = false;
        const wrapper = shallow(<ReferenceToolbar {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when [term='foo']", () => {
        props.term = "foo";
        const wrapper = shallow(<ReferenceToolbar {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should call onFind() when input changes", () => {
        const wrapper = shallow(<ReferenceToolbar {...props} />);
        const e = { target: { value: "baz" } };
        wrapper.find(InputSearch).simulate("change", e);
        expect(props.onFind).toHaveBeenCalledWith(e);
    });
});
