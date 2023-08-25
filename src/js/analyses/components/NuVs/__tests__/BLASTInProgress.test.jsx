import { shallow } from "enzyme";
import React from "react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { RIDTiming } from "../BLASTInProgress";

describe("<RIDTiming>", () => {
    const props = {
        interval: 30,
        lastCheckedAt: "2019-02-10T17:11:00.000000Z",
    };

    const RealDate = Date;

    beforeAll(() => {
        Date.now = vi.fn(() => new Date("2019-02-10T17:11:23.000000Z"));
    });

    it("should render", () => {
        const wrapper = shallow(<RIDTiming {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    afterAll(() => {
        Date = RealDate;
    });
});
