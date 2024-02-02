import { shallow } from "enzyme";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Input } from "../../../../../base";
import { SourceType } from "../../SourceType";
import { IsolateForm } from "../IsolateForm";

describe("<IsolateForm />", () => {
    let props;

    beforeEach(() => {
        props = {
            sourceType: "isolate",
            sourceName: "A",
            allowedSourceTypes: ["isolate", "genotype"],
            restrictSourceTypes: true,
            onChange: vi.fn(),
            onSubmit: vi.fn(),
        };
    });

    it("should render with source types restricted", () => {
        const wrapper = shallow(<IsolateForm {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render with source types unrestricted", () => {
        props.restrictSourceTypes = false;
        const wrapper = shallow(<IsolateForm {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it.each([
        ["genotype", "genotype", "A"],
        ["unknown", "unknown", ""],
    ])("should call onChange() when source type changes to %p", (value, sourceType, sourceName) => {
        const e = {
            target: {
                value,
            },
        };
        const wrapper = shallow(<IsolateForm {...props} />);
        wrapper.find(SourceType).simulate("change", e);
        expect(props.onChange).toHaveBeenCalledWith({
            sourceName,
            sourceType,
        });
    });

    it("should call onChange() when source name changes", () => {
        const e = {
            target: {
                value: "B",
            },
        };
        const wrapper = shallow(<IsolateForm {...props} />);
        wrapper.find(Input).at(0).simulate("change", e);
        expect(props.onChange).toHaveBeenCalledWith({
            sourceName: "B",
            sourceType: "isolate",
        });
    });
});
