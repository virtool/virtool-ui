import { JobAction } from "../Action";

describe("<JobActionIcon />", () => {
    let props;

    beforeEach(() => {
        props = {
            state: "waiting",
            canCancel: true,
            canArchive: true,
            onCancel: vi.fn(),
            onArchive: vi.fn()
        };
    });

    it.each(["waiting", "running", "cancelled", "error", "complete"])("should render when [state=%p]", state => {
        props.state = state;
        const wrapper = shallow(<JobAction {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render when [state="waiting"] and [canCancel=false]', () => {
        props.canCancel = false;
        const wrapper = shallow(<JobAction {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render when [state="complete"] and [canArchive=false]', () => {
        props.state = "complete";
        props.canArchive = false;
        const wrapper = shallow(<JobAction {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should call onCancel() when cancel icon clicked", () => {
        const wrapper = shallow(<JobAction {...props} />);
        wrapper.find("Icon").prop("onClick")();
        expect(props.onCancel).toHaveBeenCalled();
    });

    it("should call onArchive() when archive icon clicked", () => {
        props.state = "complete";
        const wrapper = shallow(<JobAction {...props} />);
        wrapper.find("Icon").prop("onClick")();
        expect(props.onArchive).toHaveBeenCalled();
    });
});
