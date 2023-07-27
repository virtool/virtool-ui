import { shallow } from "enzyme";
import React from "react";
import { describe, expect, it } from "vitest";
import { NotFound } from "../NotFound";

describe("<NotFound />", () => {
    it("should render default", () => {
        expect(shallow(<NotFound />)).toMatchSnapshot();
    });

    it("should render with status", () => {
        expect(shallow(<NotFound status={409} />)).toMatchSnapshot();
    });

    it("should render with message", () => {
        expect(shallow(<NotFound message="Resource missing" />)).toMatchSnapshot();
    });
});
