import { HMMDetail, mapStateToProps, mapDispatchToProps } from "../Detail";

describe("<HMMDetail />", () => {
    let props;

    beforeEach(() => {
        props = {
            onGet: vi.fn(),
            error: false,
            detail: {
                names: ["HMM Name"],
                cluster: 44,
                length: 122,
                mean_entropy: 0.52,
                total_entropy: 132.7,
                entries: ["Foo"],
                families: "Bar",
                genera: "Baz"
            },
            match: {
                params: {
                    hmmId: "bar"
                }
            }
        };
    });

    describe("<HMMDetail />", () => {
        it("should render correctly when props.error = true", () => {
            props.error = ["An error occurred"];

            renderWithProviders(<HMMDetail {...props} />);

            expect(screen.getByText("404")).toBeInTheDocument();
            expect(screen.getByText("Not found")).toBeInTheDocument();
        });

        it("should render loading when props.detail = null", () => {
            props.detail = null;

            renderWithProviders(<HMMDetail {...props} />);

            expect(screen.getByLabelText("loading")).toBeInTheDocument();
        });
    });

    it("should render General table correctly", () => {
        renderWithProviders(<HMMDetail {...props} />);

        expect(screen.getByText("General")).toBeInTheDocument();

        expect(screen.getByText("Cluster")).toBeInTheDocument();
        expect(screen.getByText("44")).toBeInTheDocument();

        expect(screen.getByText("Best Definitions")).toBeInTheDocument();

        expect(screen.getByText("Length")).toBeInTheDocument();
        expect(screen.getByText("122")).toBeInTheDocument();

        expect(screen.getByText("Mean Entropy")).toBeInTheDocument();
        expect(screen.getByText("0.52")).toBeInTheDocument();
    });

    it("should render Cluster table correctly", () => {
        props.detail.entries = [
            { accession: "NP_111111", gi: "7777777", name: "testName1", organism: "testOrganism1" },
            { accession: "NP_222222", gi: "8888888", name: "testName2", organism: "testOrganism2" },
            { accession: "NP_333333", gi: "9999999", name: "testName3", organism: "testOrganism3" }
        ];

        renderWithProviders(<HMMDetail {...props} />);

        expect(screen.getByText("Cluster Members")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();

        expect(screen.getByText("Accession")).toBeInTheDocument();
        expect(screen.getByText("NP_111111")).toBeInTheDocument();
        expect(screen.getByText("NP_333333")).toBeInTheDocument();

        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("testName1")).toBeInTheDocument();
        expect(screen.getByText("testName3")).toBeInTheDocument();

        expect(screen.getByText("Organism")).toBeInTheDocument();
        expect(screen.getByText("testOrganism1")).toBeInTheDocument();
        expect(screen.getByText("testOrganism3")).toBeInTheDocument();
    });

    describe("HMMTaxonomy", () => {
        it("should render Families correctly", () => {
            props.detail.families = {
                family1: 106,
                family2: 206
            };

            renderWithProviders(<HMMDetail {...props} />);

            expect(screen.getByText("Families")).toBeInTheDocument();

            expect(screen.getByText("family1")).toBeInTheDocument();
            expect(screen.getByText("106")).toBeInTheDocument();
            expect(screen.getByText("family2")).toBeInTheDocument();
            expect(screen.getByText("206")).toBeInTheDocument();
        });

        it("should render Genera correctly", () => {
            props.detail.genera = {
                genera1: 900,
                genera2: 981
            };

            renderWithProviders(<HMMDetail {...props} />);

            expect(screen.getByText("Genera")).toBeInTheDocument();

            expect(screen.getByText("genera1")).toBeInTheDocument();
            expect(screen.getByText("900")).toBeInTheDocument();
            expect(screen.getByText("genera2")).toBeInTheDocument();
            expect(screen.getByText("981")).toBeInTheDocument();
        });
    });
});

describe("mapStateToProps()", () => {
    const state = {
        errors: {
            GET_HMM_ERROR: true
        },
        hmms: {
            detail: "foo"
        }
    };
    it("should return props", () => {
        const props = mapStateToProps(state);
        expect(props).toEqual({
            error: true,
            detail: "foo"
        });
    });
});

describe("mapDispatchToProps()", () => {
    const dispatch = vi.fn();

    it("should return onGet() in props", () => {
        const props = mapDispatchToProps(dispatch);
        props.onGet("foo");
        expect(dispatch).toHaveBeenCalledWith({ payload: { hmmId: "foo" }, type: "GET_HMM_REQUESTED" });
    });
});
