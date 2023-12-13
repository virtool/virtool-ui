import { shallow } from "enzyme";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import AnalysisHMMAlert from "../HMMAlert";

describe("<AnalysisHMMAlert />", () => {
    let props;

    beforeEach(() => {
        props = {
            installed: true,
        };
    });

    it("should render", () => {
        const wrapper = shallow(<AnalysisHMMAlert {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when [installed = false]", () => {
        props.installed = false;
        const wrapper = shallow(<AnalysisHMMAlert {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});
