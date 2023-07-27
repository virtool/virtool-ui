import { shallow } from "enzyme";
import React from "react";
import { describe, expect, it } from "vitest";
import IndexGeneral from "../General";

describe("<IndexGeneral />", () => {
    it("should render", () => {
        const wrapper = shallow(<IndexGeneral />);
        expect(wrapper).toMatchSnapshot();
    });
});
