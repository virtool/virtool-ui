import { shallow } from "enzyme";
import React from "react";
import { describe, expect, it } from "vitest";
import { LoadingPlaceholder } from "../LoadingPlaceholder";

describe("<LoadingPlaceholder />", () => {
    it("should render", () => {
        const wrapper = shallow(<LoadingPlaceholder />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render the provided message", () => {
        const wrapper = shallow(<LoadingPlaceholder message="Test Message" />);
        expect(wrapper).toMatchSnapshot();
    });
});
