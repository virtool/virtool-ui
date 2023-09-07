import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import { createStore } from "redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../../../../tests/setupTests";
import { checkReferenceRight } from "../../../../selectors";
import { mapDispatchToProps, mapStateToProps, Targets } from "../Targets";

vi.mock("../../../../selectors.js");

const createAppStore = state => () => createStore(state => state, state);

const renderWithRouter = (ui, state, history) => {
    return renderWithProviders(<Router history={history}>{ui}</Router>, createAppStore(state));
};
describe("<Targets />", () => {
    let props;
    let state;
    let history;

    beforeEach(() => {
        props = {
            canModify: true,
            dataType: "barcode",
            targets: [{ name: "foo" }],
            onRemove: vi.fn(),
            refId: "bar",
            onShowEdit: vi.fn(),
        };
        state = {
            references: {
                detail: {},
            },
            router: {
                location: {},
            },
        };
        history = createBrowserHistory();
    });

    it("should render when [canModify=true]", () => {
        const wrapper = shallow(<Targets {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when [canModify=false]", () => {
        props.canModify = false;
        const wrapper = shallow(<Targets {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render null when [dataType!=barcode]", () => {
        props.dataType = "genome";
        const wrapper = shallow(<Targets {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should show modal when showAdd() is called", async () => {
        renderWithRouter(<Targets {...props} />, state, history);
        await userEvent.click(screen.getByRole("link", { name: "Add target" }));
        expect(history.location.state.addTarget).toBe(true);
    });

    it("should show modal when showEdit() is called", async () => {
        renderWithRouter(<Targets {...props} />, state, history);
        await userEvent.click(screen.getByRole("button", { name: "edit" }));
        expect(props.onShowEdit).toHaveBeenCalledWith("foo");
    });

    it("should call onRemove() when TargetItem removed", async () => {
        renderWithRouter(<Targets {...props} />, state, history);
        await userEvent.click(screen.getByRole("button", { name: "remove" }));
        expect(props.onRemove).toHaveBeenCalledWith("bar", { targets: [] });
    });
});

describe("mapStateToProps()", () => {
    const state = {
        references: {
            detail: {
                id: "baz",
                targets: [
                    { name: "foo", description: "bar", required: false },
                    { name: "Foo", description: "Bar", required: true },
                ],
            },
        },
    };

    it("should return props when user can modify ref", () => {
        checkReferenceRight.mockReturnValue(true);

        const result = mapStateToProps(state);

        expect(result).toEqual({
            canModify: true,
            refId: "baz",
            targets: [
                { name: "foo", description: "bar", required: false },
                { name: "Foo", description: "Bar", required: true },
            ],
        });
    });

    it("should return props when user cannot modify ref", () => {
        checkReferenceRight.mockReturnValue(false);

        const result = mapStateToProps(state);

        expect(result).toEqual({
            canModify: false,
            refId: "baz",
            targets: [
                { name: "foo", description: "bar", required: false },
                { name: "Foo", description: "Bar", required: true },
            ],
        });
    });
});

describe("mapDispatchToProps()", () => {
    it("should return onRemove in props", () => {
        const dispatch = vi.fn();
        const props = mapDispatchToProps(dispatch);
        props.onRemove("foo", "bar");
        expect(dispatch).toHaveBeenCalledWith({
            payload: { refId: "foo", update: "bar" },
            type: "EDIT_REFERENCE_REQUESTED",
        });
    });
});
