import { Input, InputSelect } from "../../../../base";
import { SourceType } from "../SourceType";

describe("<SourceType />", () => {
    let props;

    beforeEach(() => {
        props = {
            restrictSourceTypes: true,
            allowedSourceTypes: ["foo", "bar"],
            value: "bar",
            onChange: vi.fn()
        };
    });

    it("should render", () => {
        const wrapper = shallow(<SourceType {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when [restrictSourceTypes=false]", () => {
        props.restrictSourceTypes = false;
        const wrapper = shallow(<SourceType {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should call onChange() when input changes while [restrictSourceTypes=true]", () => {
        props.restrictSourceTypes = false;
        const wrapper = shallow(<SourceType {...props} />);
        const e = {
            target: {
                value: "Foo"
            }
        };
        wrapper.find(Input).simulate("change", e);
        expect(props.onChange).toHaveBeenCalledWith(e);
    });

    it("should call onChange() when input changes while [restrictSourceTypes=false]", () => {
        const wrapper = shallow(<SourceType {...props} />);
        const e = {
            target: {
                value: "Foo"
            }
        };
        wrapper.find(InputSelect).simulate("change", e);
        expect(props.onChange).toHaveBeenCalledWith(e);
    });
});
