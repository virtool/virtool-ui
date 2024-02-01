import { shallow } from "enzyme";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUSH_STATE } from "../../../app/actionTypes";
import { mapDispatchToProps, mapStateToProps, OTUsList } from "../OTUList";

describe("<OTUsList />", () => {
    let props;

    beforeEach(() => {
        props = {
            refId: "foo",
            term: "bar",
            verified: true,
            onLoadNextPage: vi.fn(),
            documents: ["foo"],
            page: 1,
            page_count: 1,
            renderRow: true,

            references: { detail: { id: 1 } },
            otus: { verified: true },
        };
    });

    it("should render", () => {
        const wrapper = shallow(<OTUsList {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when [this.props.documents === null]", () => {
        props.documents = null;
        const wrapper = shallow(<OTUsList {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when [this.props.documents.length == false]", () => {
        props.documents = false;
        const wrapper = shallow(<OTUsList {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

describe("mapStateToProps()", () => {
    it("should return props", () => {
        const state = {
            otus: { verified: true },
            references: { detail: { id: "bar" } },
        };
        const result = mapStateToProps(state);

        expect(result).toEqual({
            refId: "bar",
            verified: true,
        });
    });
});

describe("mapDispatchToProps()", () => {
    const dispatch = vi.fn();
    const props = mapDispatchToProps(dispatch);

    it("should return onHide() in props", () => {
        props.onHide();
        expect(dispatch).toHaveBeenCalledWith({
            type: PUSH_STATE,
            payload: {
                state: {
                    createOTU: false,
                },
            },
        });
    });

    it("should return onLoadNextPage() in props", () => {
        props.onLoadNextPage("foo", "bar", true, 1);
        expect(dispatch).toHaveBeenCalledWith({
            payload: { refId: "foo", term: "bar", verified: true, page: 1 },
            type: "FIND_OTUS_REQUESTED",
        });
    });
});
