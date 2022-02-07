import { UploadItem } from "../UploadItem";
import userEvent from "@testing-library/user-event";

describe("<UploadItem />", () => {
    let props;

    beforeEach(() => {
        props = {
            name: "Foo.fa",
            progress: 0,
            size: 871290,
            onRemove: jest.fn(),
            localId: "foo_id",
            failed: false
        };
    });

    it("should render when [progress === 0]", () => {
        const wrapper = shallow(<UploadItem {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should render when [progress > 0]", () => {
        props.progress = 51;
        const wrapper = shallow(<UploadItem {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should dispatch action to remove sample", () => {
        props.failed = true;
        const screen = renderWithProviders(<UploadItem {...props} />);
        userEvent.click(screen.getByLabelText("delete Foo.fa"));
        expect(props.onRemove).toHaveBeenCalledWith(props.localId);
    });
});
