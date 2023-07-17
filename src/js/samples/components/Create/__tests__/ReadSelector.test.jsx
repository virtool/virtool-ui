import { shallow } from "enzyme";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InputSearch } from "../../../../base";
import ReadSelector, { ReadSelectorButton } from "../ReadSelector";

describe("<ReadSelector />", () => {
    let props;

    beforeEach(() => {
        props = {
            files: [{ id: 21, size: 1024, name: "bar" }],
            error: "foo",
            selected: [21, 23],
            onSelect: vi.fn(),
            handleSelect: vi.fn(),
        };
    });

    it("should render", () => {
        const wrapper = shallow(<ReadSelector {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should call onChange() on update if files change", () => {
        const wrapper = shallow(<ReadSelector {...props} />);
        wrapper.setProps({
            files: [{ id: 21, size: 2048, name: "Bar" }],
        });
        expect(props.onSelect).toHaveBeenCalled();
    });

    it("should not call onChange() on update files do not change", () => {
        const files = props.files;
        const wrapper = shallow(<ReadSelector {...props} />);
        wrapper.setProps({
            files,
        });
        expect(props.onSelect).not.toHaveBeenCalled();
    });

    it("should change state when Input onChange is called", () => {
        const wrapper = shallow(<ReadSelector {...props} />);
        const e = {
            target: {
                value: "Baz",
            },
        };
        wrapper.find(InputSearch).simulate("change", e);
        expect(wrapper.state()).toEqual({ filter: "Baz" });
    });

    it("should call reset when reset Button is clicked", () => {
        const wrapper = shallow(<ReadSelector {...props} />);
        const e = {
            preventDefault: vi.fn(),
        };
        wrapper.find(ReadSelectorButton).at(0).simulate("click", e);
        expect(wrapper.state()).toEqual({ filter: "" });
        expect(props.onSelect).toHaveBeenCalledWith([]);
    });

    it("should call reset when swap Button is clicked", () => {
        const wrapper = shallow(<ReadSelector {...props} />);
        wrapper.find(ReadSelectorButton).at(1).simulate("click");
        expect(props.onSelect).toHaveBeenCalledWith([23, 21]);
    });
});
