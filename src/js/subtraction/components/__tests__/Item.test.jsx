import { shallow } from "enzyme";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { mapStateToProps, SubtractionItem } from "../Item";

describe("<SubtractionItem />", () => {
    let props;

    beforeEach(() => {
        props = {
            id: "foo",
            name: "Foo",
            user: { handle: "bar" },
            ready: true,
        };
    });

    it.each([true, false])("should render when [ready=%p]", ready => {
        props.ready = ready;
        const wrapper = shallow(<SubtractionItem {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it.each([null, 0])("should render when [create_at=%p]", created_at => {
        props.created_at = created_at;
        const wrapper = shallow(<SubtractionItem {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

describe("mapStateToProps()", () => {
    it("should return props", () => {
        const state = {
            subtraction: {
                documents: [
                    { id: "foo", name: "Foo", ready: true },
                    { id: "bar", name: "Bar", ready: true },
                    { id: "baz", name: "Baz", ready: true },
                ],
            },
        };
        const props = mapStateToProps(state, { index: 1 });
        expect(props).toEqual({
            id: "bar",
            name: "Bar",
            ready: true,
        });
    });
});
