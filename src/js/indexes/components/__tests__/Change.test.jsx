import { shallow } from "enzyme";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { IndexChange, mapStateToProps } from "../Change";

describe("<IndexChange />", () => {
    let props;

    beforeEach(() => {
        props = {
            description: "foo",
            otuName: "bar",
        };
    });

    it("should render", () => {
        const wrapper = shallow(<IndexChange {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when [otuName=null]", () => {
        props.otuName = null;
        const wrapper = shallow(<IndexChange {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

describe("mapStateToProps", () => {
    it("should return props", () => {
        const state = {
            indexes: {
                history: {
                    documents: [
                        {
                            otu: {
                                name: "Baz",
                            },
                            description: "Boom",
                        },
                    ],
                },
            },
        };
        const ownProps = {
            index: 0,
        };
        const props = mapStateToProps(state, ownProps);

        expect(props).toEqual({
            description: "Boom",
            otuName: "Baz",
        });
    });
});
