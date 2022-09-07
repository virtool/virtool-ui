import { Analyses } from "../Analyses";
import { vi } from "vitest";

describe("<Analyses />", () => {
    let props;

    beforeEach(() => {
        props = {
            loading: false,
            onFindAnalyses: vi.fn(),
            onClearAnalyses: vi.fn(),
            onFindHmms: vi.fn(),
            onListReadyIndexes: vi.fn(),
            match: { params: { sampleId: "foo" } }
        };
    });

    it("should render sub-components when not loading", () => {
        const wrapper = shallow(<Analyses {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render placeholder when loading", () => {
        props.loading = true;
        const wrapper = shallow(<Analyses {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should call dispatch functions on mount", () => {
        shallow(<Analyses {...props} />);
        expect(props.onFindAnalyses).toHaveBeenCalledWith("foo");
        expect(props.onFindHmms).toHaveBeenCalled();
        expect(props.onListReadyIndexes).toHaveBeenCalled();
    });

    it("should call onClearAnalyses() on unmount", () => {
        const wrapper = shallow(<Analyses {...props} />);
        expect(props.onClearAnalyses).not.toHaveBeenCalled();
        wrapper.unmount();
        expect(props.onClearAnalyses).toHaveBeenCalled();
    });
});
