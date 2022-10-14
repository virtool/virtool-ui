import { Alert } from "../Alert";

describe("<Alert />", () => {
    test.each(["blue", "green", "red"])("should render when [color=%p]", color => {
        const wrapper = shallow(<Alert color={color} />);
        expect(wrapper).toMatchSnapshot();
    });
});
