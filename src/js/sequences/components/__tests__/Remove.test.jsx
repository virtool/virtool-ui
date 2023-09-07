import { shallow } from "enzyme";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RemoveModal } from "../../../base";
import { RemoveSequence } from "../Remove";

describe("<RemoveSequence />", () => {
    let props;

    beforeEach(() => {
        props = {
            otuId: "foo",
            isolateId: "bar",
            isolateName: "baz",
            sequenceId: "test",
            onHide: vi.fn(),
            onConfirm: vi.fn(),
        };
    });

    it("renders correctly", () => {
        const wrapper = shallow(<RemoveSequence {...props} />).dive();
        expect(wrapper).toMatchSnapshot();
    });

    it("calls onConfirm when remove confirmed", () => {
        const wrapper = shallow(<RemoveSequence {...props} />);
        wrapper.find(RemoveModal).prop("onConfirm")();
        expect(props.onConfirm).toHaveBeenCalledWith("foo", "bar", "test");
    });

    it("calls onHide when hidden", () => {
        const wrapper = shallow(<RemoveSequence {...props} />);
        wrapper.find(RemoveModal).prop("onHide")();
        expect(props.onHide).toHaveBeenCalled();
    });
});
