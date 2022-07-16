import React from "react";
import { UPDATE_JOB_SEARCH } from "../../../app/actionTypes";
import { JobsToolbar, mapDispatchToProps, mapStateToProps } from "../Toolbar.js";

jest.mock("../../../utils/utils");

describe("<JobsToolbar />", () => {
    let props;

    beforeEach(() => {
        props = {
            onFind: jest.fn(),
            term: "foo"
        };
    });

    it("should render", () => {
        const wrapper = shallow(<JobsToolbar {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

describe("mapStateToProps", () => {
    it("should return correct props", () => {
        const state = {
            jobs: {
                term: "bar"
            },
            account: {
                administrator: true,
                permissions: true
            },
            router: { location: new window.URL("https://www.virtool.ca?find=bar") }
        };
        const props = mapStateToProps(state);
        expect(props).toEqual({
            term: "bar"
        });
    });
});

describe("mapDispatchToProps", () => {
    it("should return onFind() in props", () => {
        const dispatch = jest.fn();
        const props = mapDispatchToProps(dispatch);
        const e = {
            target: {
                value: "Foo"
            }
        };
        props.onUpdateJobsSearch(e, "foo", "bar");
        expect(dispatch).toHaveBeenCalledWith({
            type: UPDATE_JOB_SEARCH,
            payload: { searchParameters: { find: "Foo" } }
        });
    });
});
