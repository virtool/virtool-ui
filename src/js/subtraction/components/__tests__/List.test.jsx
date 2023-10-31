import { shallow } from "enzyme";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { SubtractionList } from "../List";

describe("<SubtractionList />", () => {
    let props;
    let wrapper;
    //
    it("renders correctly", () => {
        props = {
            filter: "test",
            total_count: 1,
            fetched: true,
            ready_host_count: 1,
            page: 1,
            page_count: 1,
            isLoading: false,
            errorLoad: false,
            refetchPage: false,
            documents: ["one", "two", "three"],
            canModify: true,
            onFilter: vi.fn(),
            loadNextPage: vi.fn(),
        };
        wrapper = shallow(
            <MemoryRouter initialEntries={[{ key: "test", pathname: "/subtractions" }]}>
                <SubtractionList {...props} />
            </MemoryRouter>,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
