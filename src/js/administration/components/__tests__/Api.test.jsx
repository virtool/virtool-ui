import { Api, mapStateToProps, mapDispatchToProps } from "../Api";
import { UPDATE_SETTINGS } from "../../../app/actionTypes";

describe("<Api />", () => {
    let props;

    beforeEach(() => {
        props = {
            enabled: true,
            onToggle: vi.fn()
        };
    });

    it("should render", () => {
        const wrapper = shallow(<Api {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
    it("should render when [onToggle=true]", () => {
        const wrapper = shallow(<Api {...props} />);
        wrapper.find("SettingsCheckbox").simulate("toggle", "foo");
        expect(props.onToggle).toHaveBeenCalledWith("foo");
    });
    it("should render when [onToggle=false]", () => {
        props.enabled = false;
        const wrapper = shallow(<Api {...props} />);
        wrapper.find("SettingsCheckbox").simulate("toggle", "foo");
        expect(props.onToggle).toHaveBeenCalledWith("foo");
    });
});

describe("mapStateToProps", () => {
    it("should return props", () => {
        const state = {
            settings: {
                data: {
                    enable_api: true
                }
            }
        };
        const props = mapStateToProps(state);

        expect(props).toEqual({ enabled: true });
    });
});

describe("mapDispatchToProps", () => {
    it("should call dispatch", () => {
        const dispatch = vi.fn();
        const value = "foo";
        const props = mapDispatchToProps(dispatch);
        props.onToggle(value);
        expect(dispatch).toHaveBeenCalledWith({
            payload: {
                update: {
                    enable_api: "foo"
                }
            },
            type: UPDATE_SETTINGS.REQUESTED
        });
    });
});
