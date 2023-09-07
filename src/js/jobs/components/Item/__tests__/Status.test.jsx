import { shallow } from "enzyme";
import React from "react";
import { describe, expect, it } from "vitest";
import { JobStatus } from "../Status";

describe("<JobStatusIcon />", () => {
    describe.each([true, false])("should render when [pad=%p]", pad => {
        const props = { pad };

        it.each(["waiting", "preparing", "running", "cancelled", "error", "complete"])("and [state=%p]", state => {
            props.state = state;
            const wrapper = shallow(<JobStatus {...props} />);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
