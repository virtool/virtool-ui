import { shallow } from "enzyme";
import React from "react";
import { describe, expect, it } from "vitest";
import { NoneFound } from "../NoneFound";
import { NoneFoundBox } from "../NoneFoundBox";
import { NoneFoundSection } from "../NoneFoundSection";

describe("<NoneFound />", () => {
    it("should render with [noun='files'", () => {
        expect(shallow(<NoneFound noun="files" />)).toMatchSnapshot();
    });
});

describe("<NoneFoundBox />", () => {
    it("should render with [noun='boxes'", () => {
        expect(shallow(<NoneFoundBox noun="boxes" />)).toMatchSnapshot();
    });
});

describe("<NoneFoundSection />", () => {
    it("should render with [noun='sections'", () => {
        expect(shallow(<NoneFoundSection noun="sections" />)).toMatchSnapshot();
    });

    it("should render with [noun='sections'] and children", () => {
        expect(
            shallow(
                <NoneFoundSection noun="sections">
                    <span>foo</span>
                </NoneFoundSection>,
            ),
        ).toMatchSnapshot();
    });
});
