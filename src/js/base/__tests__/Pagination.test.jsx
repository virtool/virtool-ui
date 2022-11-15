import { Pagination } from "../Pagination";
import { screen } from "@testing-library/react";

describe("<Pagination />", () => {
    let props;

    beforeEach(() => {
        props = {
            pageCount: 6,
            currentPage: 1
        };
    });

    it("Should render correctly when pageCount=6 and currentPage=1", () => {
        renderWithProviders(<Pagination {...props} />);
        expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "5" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "6" })).not.toBeInTheDocument();
    });

    it("should render correclty when pageCount=6 and currentPage = 3", () => {
        props.currentPage = 3;
        renderWithProviders(<Pagination {...props} />);
        expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "1" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "6" })).not.toBeInTheDocument();
    });

    it("should render correctly when pageCount=0", () => {
        props.pageCount = 0;
        renderWithProviders(<Pagination {...props} />);
        expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "1" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "3" })).not.toBeInTheDocument();
    });

    it("should render correctly when pageCount=3", () => {
        props.pageCount = 3;
        renderWithProviders(<Pagination {...props} />);
        expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "4" })).not.toBeInTheDocument();
    });
});
