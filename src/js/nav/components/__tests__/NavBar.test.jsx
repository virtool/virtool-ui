import {Bar, mapDispatchToProps, mapStateToProps} from "../NavBar";
import {logout} from "../../../account/actions";

describe("<Bar />", () => {
    const props = {
        administrator: true,
        id: "foo",
        pending: false,
        onLogout: vi.fn()
    };
    it("should render", () => {
        const wrapper = shallow(<Bar {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

describe("mapStateToProps", () => {
    const state = {
        account: { foo: "bar" },
        app: {
            pending: false
        }
    };
    it("should return props", () => {
        const result = mapStateToProps(state);
        expect(result).toEqual({
            foo: "bar",
            pending: false
        });
    });
});

describe("mapDispatchToProps", () => {
    const dispatch = vi.fn();

    window.b2c = {
        use: false
    };

    it("should return onLogout in props", () => {
        const props = mapDispatchToProps(dispatch);
        props.onLogout();
        expect(dispatch).toHaveBeenCalledWith(logout());
    });
});
