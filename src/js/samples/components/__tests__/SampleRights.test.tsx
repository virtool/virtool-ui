import { screen } from "@testing-library/react";
import { shallow } from "enzyme";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../../tests/setupTests";
import { InputSelect } from "../../../base";
import SampleRights from "../SampleRights";

describe("<SampleRights />", () => {
    let props;

    beforeEach(() => {
        props = {
            sampleGroup: "force_choice",
            group: "rw",
            all: "rw",
            onChangeSampleGroup: vi.fn(),
            onChangeRights: vi.fn(),
        };
    });

    it("should render", () => {
        const wrapper = shallow(<SampleRights {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should call onChangeSampleGroup() when group SelectBox is clicked", () => {
        renderWithProviders(<SampleRights {...props} />);
        const selectButtons = screen.getAllByRole("button");
        selectButtons[0].click();
        expect(props.onChangeSampleGroup).toHaveBeenCalledWith("none");
    });
    it("should call onChangeSampleGroup() when force choice SelectBox is clicked", () => {
        renderWithProviders(<SampleRights {...props} />);
        const selectButtons = screen.getAllByRole("button");
        selectButtons[1].click();
        expect(props.onChangeSampleGroup).toHaveBeenCalledWith("force_choice");
    });
    it("should call onChangeSampleGroup() when users primary group SelectBox is clicked", () => {
        renderWithProviders(<SampleRights {...props} />);
        const selectButtons = screen.getAllByRole("button");
        selectButtons[2].click();
        expect(props.onChangeSampleGroup).toHaveBeenCalledWith("users_primary_group");
    });

    it.each(["group", "all"])("should call onChangeRights() when %p input changes", scope => {
        const wrapper = shallow(<SampleRights {...props} />);
        const e = {
            target: {
                value: "r",
            },
        };
        wrapper
            .find(InputSelect)
            .at(scope === "all" ? 1 : 0)
            .simulate("change", e);
        expect(props.onChangeRights).toHaveBeenCalledWith(scope, "r");
    });
});
