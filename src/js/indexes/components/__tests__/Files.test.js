import { Files } from "../Files";
import { screen } from "@testing-library/react";

describe("<IndexDetail />", () => {
    let props;

    beforeEach(() => {
        props = {
            files: [
                { id: "1", name: "foo", download_url: "https://Virtool.ca/testUrl/foo", size: "1024" },

                { id: "2", name: "bar", download_url: "https://Virtool.ca/testUrl/bar", size: "2048" }
            ]
        };
    });

    it("should render", () => {
        const wrapper = shallow(<Files {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it("should show component", () => {
        renderWithProviders(<Files {...props} />);
        expect(screen.getByText("Files")).toBeInTheDocument();
    });

    it("should render names", () => {
        renderWithProviders(<Files {...props} />);
        expect(screen.getByText("foo")).toBeInTheDocument();
    });

    it("should render sizes", () => {
        renderWithProviders(<Files {...props} />);
        expect(screen.getByText("1.0KB")).toBeInTheDocument();
    });
    it("should include url", () => {
        renderWithProviders(<Files {...props} />);
        // console.log(screen.getAllByRole("link", {})[0]);
        expect(screen.getAllByRole("link", {})[0]).toHaveAttribute("href", "https://Virtool.ca/testUrl/foo");
    });
});
