import { AnalysesList } from "../List";
import { vi } from "vitest";

describe("<AnalysesList />", () => {
    let props;

    beforeEach(() => {
        props = {
            showCreate: true,
            userId: "bob",
            sampleId: "foo",
            analyses: [{ id: "bar" }],
            term: "baz",
            indexes: [{ id: "indy" }],
            hmmsInstalled: true,
            canModify: true,
            onFind: vi.fn()
        };
    });

    it("renders", () => {
        const wrapper = shallow(<AnalysesList {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});
