import { shallow } from "enzyme";
import React from "react";
import { describe, expect, it } from "vitest";
import { Tooltip } from "../Tooltip";

describe("<Tooltip />", () => {
    const props = {
        tip: "Tip",
        position: "left",
    };

    it("should render", () => {
        const wrapper = shallow(<Tooltip {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render without position prop", () => {
        const wrapper = shallow(<Tooltip {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render with children", () => {
        const wrapper = shallow(<Tooltip {...props}>Hello world</Tooltip>);
        expect(wrapper).toMatchSnapshot();
    });
});
