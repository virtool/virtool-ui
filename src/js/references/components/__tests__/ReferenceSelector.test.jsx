import { ReferenceSelector } from "../ReferenceSelector";
import { vi } from "vitest";

describe("<ReferenceSelector />", () => {
    let props;
    beforeEach(() => {
        props = {
            references: [{ id: "foo", key: "bar" }],
            hasError: false,
            selected: true,
            onSelect: vi.fn()
        };
    });

    it("should render", () => {
        const wrapper = shallow(<ReferenceSelector {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render NoneFound when [references.length=0]", () => {
        props.references = [];
        const wrapper = shallow(<ReferenceSelector {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});
