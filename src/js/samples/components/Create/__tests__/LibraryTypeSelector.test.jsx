import { shallow } from "enzyme";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LibraryTypeSelector } from "../LibraryTypeSelector";

describe("<LibraryTypeSelector>", () => {
    let props;
    beforeEach(() => {
        props = {
            onSelect: vi.fn(),
            libraryType: "normal",
        };
    });

    it("should have Normal selected [libraryType='normal']", () => {
        const wrapper = shallow(<LibraryTypeSelector {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should have sRNA selected when [libraryType='srna']", () => {
        props.libraryType = "srna";
        const wrapper = shallow(<LibraryTypeSelector {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should have Amplicon selected when [libraryType='amplicon']", () => {
        props.libraryType = "amplicon";
        const wrapper = shallow(<LibraryTypeSelector {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});
