import { screen } from "@testing-library/react";
import { shallow } from "enzyme";
import nock from "nock";
import React from "react";
import { expect, it, test } from "vitest";
import { renderWithProviders } from "../../../../tests/setupTests";
import { References } from "../References";

test("<References />", () => {
    nock("http://localhost").get("/api/settings").reply(200, {});

    renderWithProviders(<References />);

    expect(screen.queryByText("Loading")).not.toBeInTheDocument();

    it.each([true, false])("should render when [loading=%p]", loading => {
        const wrapper = shallow(<References loading={loading} />);
        expect(wrapper).toMatchSnapshot();
    });
});
