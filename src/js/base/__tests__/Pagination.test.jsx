import { Pagination } from "../Pagination";
import { screen } from "@testing-library/react";

describe("<Pagination />", () => {
    let props;

    beforeEach(() => {
        props = {
            itemsPerPage: 5,
            totalItems: 30
        };
    });

    it("Should render correctly when itemsPerPage=5 and totalItems=30", () => {
        renderWithProviders(<Pagination {...props} />);
        const previousButton = screen.getByRole("button", { name: "< Previous" });
        const nextButton = screen.getByRole("button", { name: "Next >" });
        expect(previousButton).toBeInTheDocument();
        expect(nextButton).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "5" })).not.toBeInTheDocument();
        nextButton.click();
        nextButton.click();
        expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
        nextButton.click();
        nextButton.click();
        expect(screen.queryByRole("button", { name: "7" })).not.toBeInTheDocument();
    });

    it("should render correctly when totalItems=0", () => {
        props.totalItems = 0;
        renderWithProviders(<Pagination {...props} />);
        expect(screen.getByRole("button", { name: "< Previous" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Next >" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "1" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "3" })).not.toBeInTheDocument();
    });

    it("should render correctly when itemsPerPage=5 and totalItems=14", () => {
        props.totalItems = 14;
        renderWithProviders(<Pagination {...props} />);
        expect(screen.getByRole("button", { name: "< Previous" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Next >" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "4" })).not.toBeInTheDocument();
    });
});
