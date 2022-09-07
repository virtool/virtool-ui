import { Select } from "../../../../base";
import { SampleUserGroup } from "../UserGroup";
import { vi } from "vitest";

describe("SampleUserGroup", () => {
    let props;
    beforeEach(() => {
        props = {
            groups: ["foo"],
            onChange: vi.fn(),
            group: "bar"
        };
    });

    it("should render", () => {
        const wrapper = shallow(<SampleUserGroup {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
    it("should call onChange when InputError is changed", () => {
        const e = {
            target: "foo"
        };
        const wrapper = shallow(<SampleUserGroup {...props} />);
        wrapper.find(Select).simulate("change", e);
        expect(props.onChange).toHaveBeenCalledWith({ target: "foo" });
    });
});
