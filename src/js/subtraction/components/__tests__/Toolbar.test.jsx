import { FIND_SUBTRACTIONS } from "../../../app/actionTypes";
import { SearchInput } from "../../../base";
import { mapDispatchToProps, mapStateToProps, SubtractionToolbar } from "../Toolbar";
import { checkAdminOrPermission } from "../../../utils/utils";
import { vi } from "vitest";

vi.mock("../../../utils/utils.js");

describe("<SubtractionToolbar />", () => {
    let props;

    beforeEach(() => {
        props = {
            canModify: true,
            term: "foo",
            onFind: vi.fn()
        };
    });

    it("should render create button when [canModify=true]", () => {
        const wrapper = shallow(<SubtractionToolbar {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should not render create button when [canModify=false]", () => {
        props.canModify = false;
        const wrapper = shallow(<SubtractionToolbar {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should call onFind() when SearchInput changes", () => {
        const wrapper = shallow(<SubtractionToolbar {...props} />);
        const e = {
            target: {
                value: "Foo"
            }
        };
        wrapper.find(SearchInput).simulate("change", e);
        expect(props.onFind).toHaveBeenCalledWith(e);
    });
});

describe("mapStateToProps()", () => {
    let state;

    beforeEach(() => {
        state = {
            subtraction: {
                term: "Foo"
            }
        };
    });

    it.each([true, false])("should return props when [canModify=%p]", canModify => {
        checkAdminOrPermission.mockReturnValue(canModify);

        const props = mapStateToProps(state);
        expect(props).toEqual({
            term: "Foo",
            canModify
        });
    });

    it("should return props when term in state is null", () => {
        checkAdminOrPermission.mockReturnValue(true);
        state.subtraction.term = null;

        const props = mapStateToProps(state);
        expect(props).toEqual({
            term: "",
            canModify: true
        });
    });
});

describe("mapDispatchToProps()", () => {
    it.each(["Foo", ""])("should return onFind() in props that takes [value=%p]", value => {
        const dispatch = vi.fn();
        const props = mapDispatchToProps(dispatch);
        const e = { target: { value } };
        props.onFind(e);

        expect(dispatch).toHaveBeenCalledWith({
            type: FIND_SUBTRACTIONS.REQUESTED,
            payload: { term: value === "Foo" ? "Foo" : null, page: 1 }
        });
    });
});
