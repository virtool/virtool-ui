import { shallow } from "enzyme";
import React from "react";
import { describe, expect, it } from "vitest";
import Subtraction from "../Subtraction";

describe("<Subtraction />", () => {
    it("should render", () => {
        const wrapper = shallow(<Subtraction />);
        expect(wrapper).toMatchSnapshot();
    });
});
