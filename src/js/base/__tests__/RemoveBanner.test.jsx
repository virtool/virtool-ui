import { RemoveBanner } from "../RemoveBanner";
import { Button } from "../Button";
import { vi } from "vitest";

describe("<RemoveBanner />", () => {
    let props;
    let wrapper;

    beforeAll(() => {
        props = {
            message: "test",
            buttonText: "Delete",
            onClick: vi.fn()
        };
        wrapper = shallow(<RemoveBanner {...props} />);
    });

    it("renders correctly", () => {
        expect(wrapper).toMatchSnapshot();
    });

    it("clicking invokes onChange callback", () => {
        wrapper.find(Button).simulate("click");
        expect(props.onClick).toHaveBeenCalled();
    });
});
