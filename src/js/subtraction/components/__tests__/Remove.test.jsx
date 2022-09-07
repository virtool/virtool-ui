import { PUSH_STATE, REMOVE_SUBTRACTION } from "../../../app/actionTypes";
import { routerLocationHasState } from "../../../utils/utils";
import { mapDispatchToProps, mapStateToProps, RemoveSubtraction } from "../Remove";
import { vi } from "vitest";

vi.mock("../../../utils/utils.js");

describe("<RemoveSubtraction />", () => {
    let props;

    beforeEach(() => {
        props = {
            show: true,
            id: "foo",
            name: "Foo",
            onHide: vi.fn(),
            onConfirm: vi.fn()
        };
    });

    it.each([true, false])("should render when [show=%p]", show => {
        props.show = show;
        const wrapper = shallow(<RemoveSubtraction {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should call onConfirm() when onConfirm() on <RemoveModal /> is called", () => {
        const wrapper = shallow(<RemoveSubtraction {...props} />);
        wrapper.props().onConfirm();
        expect(props.onConfirm).toHaveBeenCalledWith("foo");
    });

    it("should call onHide() when onHide() on <RemoveModal /> is called", () => {
        const wrapper = shallow(<RemoveSubtraction {...props} />);
        wrapper.props().onHide();
        expect(props.onHide).toHaveBeenCalled();
    });
});

describe("mapStateToProps()", () => {
    it.each([true, false])("should return props when routerLocationHasState() returns %p", show => {
        routerLocationHasState.mockReturnValue(show);
        const state = {
            subtraction: { detail: { id: "foo", name: "Foo" } }
        };
        const props = mapStateToProps(state);
        expect(props).toEqual({
            show,
            id: "foo",
            name: "Foo"
        });
    });
});

describe("mapDispatchToProps", () => {
    let dispatch;
    let props;

    beforeEach(() => {
        dispatch = vi.fn();
        props = mapDispatchToProps(dispatch);
    });

    it("should return onHide() in props", () => {
        props.onHide();
        expect(dispatch).toHaveBeenCalledWith({
            type: PUSH_STATE,
            payload: { state: { removeSubtraction: false } }
        });
    });

    it("should return onConfirm() in props", () => {
        props.onConfirm("foo");
        expect(dispatch).toHaveBeenCalledWith({
            type: REMOVE_SUBTRACTION.REQUESTED,
            payload: { subtractionId: "foo" }
        });
    });
});
