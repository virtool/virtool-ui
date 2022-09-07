import { APIKeys } from "../API";
import { vi } from "vitest";

describe("<API />", () => {
    let props;

    beforeEach(() => {
        props = {
            apiKeys: [{ id: "foo" }, { id: "bar" }],
            onGet: vi.fn()
        };
    });

    it("should render two API keys", () => {
        const wrapper = shallow(<APIKeys {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when loading API keys", () => {
        props.apiKeys = null;
        const wrapper = shallow(<APIKeys {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render with 0 API keys", () => {
        props.apiKeys = [];
        const wrapper = shallow(<APIKeys {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});
