import { UserGroup } from "../Group";
import { vi } from "vitest";

describe("<UserGroup />", () => {
    let props;

    beforeEach(() => {
        props = {
            id: "bob",
            toggled: false,
            onClick: vi.fn()
        };
    });

    it("should render with [toggled=false]", () => {
        const wrapper = shallow(<UserGroup {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render with [toggled=true]", () => {
        props.toggled = true;
        const wrapper = shallow(<UserGroup {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should call [onClick] when clicked", () => {
        const wrapper = shallow(<UserGroup {...props} />);
        wrapper.simulate("click");
        expect(props.onClick).toHaveBeenCalledWith(props.id);
    });
});
