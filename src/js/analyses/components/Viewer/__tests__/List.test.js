jest.mock("../../../selectors");

import { getMatches, getResults } from "../../../selectors";
import { mapStateToProps, AnalysisViewerList } from "../List";

describe("<AnalysisViewerList />", () => {
    it("should render", () => {
        const props = {
            shown: 4,
            total: 10,
            children: "foo"
        };
        const wrapper = shallow(<AnalysisViewerList {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

describe("mapStateToProps()", () => {
    getMatches.mockReturnValue(["foo", "bar"]);
    getResults.mockReturnValue(["foo", "bar", "baz", "bat", "fob"]);

    const state = {
        foo: "bar"
    };

    it("should return props", () => {
        const props = mapStateToProps(state);
        expect(getMatches).toHaveBeenCalledWith(state);
        expect(getResults).toHaveBeenCalledWith(state);
        expect(props).toEqual({
            shown: 2,
            total: 5
        });
    });
});
