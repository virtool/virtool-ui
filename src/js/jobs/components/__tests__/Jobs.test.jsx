import React from "react";
import { Jobs } from "../Jobs";

describe("<Jobs />", () => {
    it("should render placeholder when loading", () => {
        const wrapper = shallow(<Jobs loading />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when loaded", () => {
        const wrapper = shallow(<Jobs loading={false} />);
        expect(wrapper).toMatchSnapshot();
    });
});
