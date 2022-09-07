import { JobItem, mapDispatchToProps } from "../Item";
import { vi } from "vitest";

describe("<JobItem />", () => {
    let props;

    beforeEach(() => {
        props = {
            id: "foo",
            progress: 100,
            workflow: "build_index",
            created_at: "Foo",
            user: {
                id: "bob",
                handle: "bob"
            },
            canCancel: true,
            canArchive: true,
            onCancel: vi.fn(),
            onArchive: vi.fn()
        };
    });

    it.each(["waiting", "running", "cancelled", "error", "complete"])("should render when [state=%p]", state => {
        props.state = state;
        const wrapper = shallow(<JobItem {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it.each([
        [true, true],
        [true, false],
        [false, true],
        [false, false]
    ])("should render when [canCancel=%p] and [canArchive=%p]", (canCancel, canArchive) => {
        props = {
            ...props,
            canCancel,
            canArchive
        };
        const wrapper = shallow(<JobItem {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});

describe("mapDispatchToProps", () => {
    it("should return onCancel() in props", () => {
        const dispatch = vi.fn();
        const props = mapDispatchToProps(dispatch);

        props.onCancel("foo");

        expect(dispatch).toHaveBeenCalledWith({
            type: "CANCEL_JOB_REQUESTED",
            payload: { jobId: "foo" }
        });
    });
    it("should return onArchive() in props", () => {
        const dispatch = vi.fn();
        const props = mapDispatchToProps(dispatch);

        props.onArchive("foo");

        expect(dispatch).toHaveBeenCalledWith({
            payload: { jobId: "foo" },
            type: "ARCHIVE_JOB_REQUESTED"
        });
    });
});
