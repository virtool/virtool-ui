import { DataTypeSelection } from "../DataTypeSelection";
import { vi } from "vitest";

describe("<DataTypeSelection />", () => {
    const props = {
        onSelect: vi.fn(),
        dataType: "genome"
    };
    it("should render", () => {
        const wrapper = shallow(<DataTypeSelection {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});
