import { shallow } from "enzyme";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { IndexOTUs, mapStateToProps } from "../OTUs";

describe("<IndexOTUs />", () => {
    let props;

    beforeEach(() => {
        props = {
            otus: [
                {
                    id: "Foo",
                    name: "Bar",
                    change_count: 1,
                },
            ],
            refId: "baz",
        };
    });

    it("should render", () => {
        const wrapper = shallow(<IndexOTUs {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

describe("mapStateToProps", () => {
    it("should return props", () => {
        const state = {
            indexes: {
                detail: {
                    otus: { refId: "foo", change_count: 1, id: "Foo", name: "bar" },
                    reference: {
                        id: "Bar",
                    },
                },
            },
        };
        const props = mapStateToProps(state);

        expect(props).toEqual({
            refId: "Bar",
            otus: { refId: "foo", change_count: 1, id: "Foo", name: "bar" },
        });
    });
});
