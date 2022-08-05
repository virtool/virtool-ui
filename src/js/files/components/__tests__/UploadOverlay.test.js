import { UploadOverlay, mapStateToProps } from "../UploadOverlay";
import { screen } from "@testing-library/react";

describe("<UploadOverlay />", () => {
    let props;

    beforeEach(() => {
        props = {
            uploads: [
                {
                    fileType: "subtraction",
                    localId: "123abc",
                    name: "test_reads.fastq.gz",
                    progress: 95,
                    size: 1024
                },
                {
                    fileType: "reads",
                    localId: "456def",
                    name: "test_reads.fastq.gz2",
                    progress: 0,
                    size: 2025
                },
                {
                    fileType: "reads",
                    localId: "789ghi",
                    name: "test_reads.fastq.gz3",
                    progress: 50,
                    size: 871290
                }
            ]
        };
    });

    it("should render correctly when there is 1 uploads", () => {
        props.uploads = [
            {
                fileType: "subtraction",
                localId: "123abc",
                name: "test_reads.fastq.gz",
                progress: 99,
                size: 871290
            }
        ];
        renderWithProviders(<UploadOverlay {...props} />);
        expect(screen.getByText("Uploads")).toBeInTheDocument();
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("test_reads.fastq.gz")).toBeInTheDocument();
        expect(screen.getByText("871.3 KB")).toBeInTheDocument();
        expect(screen.getByText("1 hour remaining")).toBeInTheDocument();
        expect(screen.getByText("0 MB/s")).toBeInTheDocument();
        expect(screen.queryByText("Finishing uploads")).not.toBeInTheDocument();
    });

    it("should render correctly when there are 3 uploads in progress", () => {
        renderWithProviders(<UploadOverlay {...props} />);
        expect(screen.getByText("Uploads")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
        expect(screen.getByText("test_reads.fastq.gz")).toBeInTheDocument();
        expect(screen.getByText("test_reads.fastq.gz2")).toBeInTheDocument();
        expect(screen.getByText("871.3 KB")).toBeInTheDocument();
        expect(screen.getByText("1.0 KB")).toBeInTheDocument();
        expect(screen.getByText("1 hour remaining")).toBeInTheDocument();
        expect(screen.getByText("0 MB/s")).toBeInTheDocument();
        expect(screen.queryByText("Finishing uploads")).not.toBeInTheDocument();
    });

    it("should render null if no uploads in progress", () => {
        props.uploads = [];
        renderWithProviders(<UploadOverlay {...props} />);
        expect(screen.queryByText("Uploads")).not.toBeInTheDocument();
        expect(screen.queryByText("NaN min remaining")).not.toBeInTheDocument();
        expect(screen.queryByText("0.0 MB/s")).not.toBeInTheDocument();
    });

    it("should render correctly when all total uploads have reached 100% progress", () => {
        props.uploads = [
            {
                fileType: "subtraction",
                localId: "123abc",
                name: "test_reads.fastq.gz",
                progress: 100,
                size: 1024
            },
            {
                fileType: "reads",
                localId: "456def",
                name: "test_reads.fastq.gz2",
                progress: 100,
                size: 2025
            }
        ];
        renderWithProviders(<UploadOverlay {...props} />);
        expect(screen.getByText("Finishing uploads")).toBeInTheDocument();
        expect(screen.queryByText("NaN min remaining")).not.toBeInTheDocument();
        expect(screen.queryByText("0.0 MB/s")).not.toBeInTheDocument();
    });
});

describe("mapStateToProps", () => {
    let state;

    beforeEach(() => {
        state = {
            files: {
                uploads: [
                    { localId: "foo", progress: 0 },
                    { localId: "bar", progress: 12 },
                    { localId: "baz", progress: 37 }
                ]
            }
        };
    });

    it("should return sorted uploads in props", () => {
        const props = mapStateToProps(state);
        const [baz, bar, foo] = props.uploads;

        expect(props).toEqual({
            uploads: [baz, bar, foo]
        });
    });

    it("should exclude reference uploads", () => {
        state.files.uploads[1].type = "reference";
        const props = mapStateToProps(state);
        const [foo, baz] = props.uploads;
        expect(props).toEqual({
            uploads: [foo, baz]
        });
    });
});
