import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../../../tests/setupTests";
import ReadSelector from "../ReadSelector";

describe("<ReadSelector />", () => {
    let props;

    beforeEach(() => {
        props = {
            data: { pages: [{ id: 21, size: 1024, name: "bar", total_count: 1 }] },
            error: "foo",
            selected: [],
            isLoading: true,
            isFetchingNextPage: false,
            onSelect: vi.fn(),
            handleSelect: vi.fn(),
        };
    });

    it("should render", () => {
        renderWithProviders(<ReadSelector {...props} />);
        expect(screen.getByText("Read files")).toBeInTheDocument();
    });

    // it("should call onChange() on update if files change", () => {
    //     props.selected = [21];
    //     renderWithProviders(<ReadSelector {...props} />);
    //     expect(screen.getByText("Readss files")).toBeInTheDocument();
    // });
    //
    // it("should not call onChange() on update files do not change", () => {
    //     const files = props.files;
    //     const wrapper = shallow(<ReadSelector {...props} />);
    //     wrapper.setProps({
    //         files,
    //     });
    //     expect(props.onSelect).not.toHaveBeenCalled();
    // });
    //
    // it("should change state when Input onChange is called", () => {
    //     const wrapper = shallow(<ReadSelector {...props} />);
    //     const e = {
    //         target: {
    //             value: "Baz",
    //         },
    //     };
    //     wrapper.find(InputSearch).simulate("change", e);
    //     expect(wrapper.state()).toEqual({ filter: "Baz" });
    // });
    //
    it("should call reset when reset Button is clicked", async () => {
        props.selected = [21];
        renderWithProviders(<ReadSelector {...props} />);
        expect(screen.getByText("1 of 1 selected")).toBeInTheDocument();

        const clearButton = screen.getByRole("button", { name: "undo" });
        userEvent.click(clearButton);

        expect(screen.getByText("Read fissles")).toBeInTheDocument();
    });
    //
    // it("should call reset when swap Button is clicked", () => {
    //     const wrapper = shallow(<ReadSelector {...props} />);
    //     wrapper.find(ReadSelectorButton).at(1).simulate("click");
    //     expect(props.onSelect).toHaveBeenCalledWith([23, 21]);
    // });
});
