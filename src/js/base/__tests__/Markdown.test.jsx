import { shallow } from "enzyme";
import React from "react";
import { describe, expect, it } from "vitest";
import { Markdown } from "../Markdown";

describe("<Markdown />", () => {
    it("should render with markdown", () => {
        const markdown = `
            # Heading
            body
        `;
        const wrapper = shallow(<Markdown markdown={markdown} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render NoneFound without markdown", () => {
        const wrapper = shallow(<Markdown markdown="" />);
        expect(wrapper).toMatchSnapshot();
    });
});
