import { CHANGE_ACTIVE_GROUP } from "../../../app/actionTypes";
import { GroupItem, mapDispatchToProps, mapStateToProps } from "../GroupItem";

describe("Group", () => {
    let props;

    beforeEach(() => {
        props = {
            id: "foo",
            active: false,
            onSelect: vi.fn()
        };
    });

    it("should render correct with default props", () => {
        const wrapper = shallow(<GroupItem {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render as active when [active=true]", () => {
        props.active = true;
        const wrapper = shallow(<GroupItem {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should call onSelect when clicked", () => {
        props.active = true;
        const wrapper = shallow(<GroupItem {...props} />);
        wrapper.simulate("click");
        expect(props.onSelect).toHaveBeenCalled();
    });
});

describe("mapStateToProps", () => {
    const state = {
        groups: { activeId: "bar" }
    };

    it("should return [active=true] when active", () => {
        const result = mapStateToProps(state, { id: "bar" });
        expect(result).toEqual({
            active: true
        });
    });

    it("should return [active=false] when not active", () => {
        const result = mapStateToProps(state, { id: "foo" });
        expect(result).toEqual({
            active: false
        });
    });
});

describe("mapDispatchToProps", () => {
    it("should call dispatch with correct action", () => {
        const dispatch = vi.fn();
        const props = mapDispatchToProps(dispatch, { id: "foo" });

        props.onSelect();

        expect(dispatch).toHaveBeenCalledWith({
            type: CHANGE_ACTIVE_GROUP,
            payload: { id: "foo" }
        });
    });
});
