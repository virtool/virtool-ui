import Subtraction from "../Subtraction";

describe("<Subtraction />", () => {
    it("should render", () => {
        const wrapper = shallow(<Subtraction />);
        expect(wrapper).toMatchSnapshot();
    });
});
