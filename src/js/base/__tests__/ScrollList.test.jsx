import { ScrollList } from "../ScrollList";

describe("<ScrollList />", () => {
    let props;

    beforeEach(() => {
        props = {
            isElement: true,
            document: [{ foo: "bar" }],
            page: 1,
            pageCount: 2,
            onLoadNextPage: vi.fn()
        };
    });

    it("should return LoadingPlaceholder when [documents=null] and [page<pageCount]", () => {
        props.documents = null;
        const wrapper = mount(<ScrollList {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should return React.Fragment when [noContainer=true]", () => {
        const wrapper = mount(<ScrollList {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when [noContainer=false]", () => {
        props.noContainer = false;
        const wrapper = mount(<ScrollList {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("componentDidMount() should call addEventListener()", () => {
        window.addEventListener = vi.fn();
        window.removeEventListener = vi.fn();

        mount(<ScrollList {...props} />);

        expect(window.addEventListener.mock.calls.slice(-1)[0][0]).toBe("scroll");
        expect(window.addEventListener.mock.calls.slice(-1)[0][1]).toBeInstanceOf(Function);
    });

    it("componentWillUnmount() should call removeEventListener()", () => {
        window.addEventListener = vi.fn();
        window.removeEventListener = vi.fn();

        const wrapper = mount(<ScrollList {...props} />);
        wrapper.unmount();

        expect(window.removeEventListener.mock.calls.slice(-2)[0][0]).toBe("scroll");
        expect(window.removeEventListener.mock.calls.slice(-2)[0][1]).toBeInstanceOf(Function);
    });
});
