import { UploadItem } from "../UploadItem";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { vi } from "vitest";

describe("<UploadItem />", () => {
    let props;

    beforeEach(() => {
        props = {
            name: "Foo.fa",
            progress: 0,
            size: 871290,
            onRemove: vi.fn(),
            localId: "foo_id",
            failed: false
        };
    });

    it("should render correctly when [progress === 0]", () => {
        renderWithProviders(<UploadItem {...props} />);
        expect(screen.getByText("Foo.fa")).toBeInTheDocument();
        expect(screen.getByText("871.3 KB")).toBeInTheDocument();
    });

    it("should render correctly when [progress > 0 and progress < 100]", () => {
        props.progress = 51;
        renderWithProviders(<UploadItem {...props} />);
        expect(screen.getByText("Foo.fa")).toBeInTheDocument();
        expect(screen.getByText("871.3 KB")).toBeInTheDocument();
    });

    it("should dispatch action to remove sample", () => {
        props.failed = true;
        const screen = renderWithProviders(<UploadItem {...props} />);
        userEvent.click(screen.getByLabelText("delete Foo.fa"));
        expect(props.onRemove).toHaveBeenCalledWith(props.localId);
    });
});
