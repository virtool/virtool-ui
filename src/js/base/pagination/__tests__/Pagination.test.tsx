import { Pagination } from "@base";
import { screen } from "@testing-library/react";
import { renderWithMemoryRouter } from "@tests/setup.jsx";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("<Pagination />", () => {
    let props;

    beforeEach(() => {
        props = {
            pageCount: 6,
            currentPage: 1,
            storedPage: 1,
            onLoadNextPage: vi.fn(),
        };
    });

    it("Should render correctly when pageCount=6 and currentPage=1", () => {
        renderWithMemoryRouter(<Pagination {...props} />, "/samples/files?page=1");
        expect(screen.getByRole("link", { name: "Previous" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Next" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "5" })).not.toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "6" })).not.toBeInTheDocument();
    });

    it("should render correctly when pageCount=6 and currentPage = 3", () => {
        props.storedPage = 3;
        renderWithMemoryRouter(<Pagination {...props} />, "/samples/files?page=1");
        expect(screen.getByRole("link", { name: "Previous" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Next" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "2" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "5" })).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "1" })).not.toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "6" })).not.toBeInTheDocument();
    });

    it("should render correctly when pageCount=0", () => {
        props.pageCount = 0;
        renderWithMemoryRouter(<Pagination {...props} />, "/samples/files?page=1");
        expect(screen.queryByRole("link", { name: "Previous" })).not.toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "Next" })).not.toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "1" })).not.toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "3" })).not.toBeInTheDocument();
    });

    it("should render correctly when pageCount=3", () => {
        props.pageCount = 3;
        renderWithMemoryRouter(<Pagination {...props} />, "/samples/files?page=1");
        expect(screen.getByRole("link", { name: "Previous" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Next" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "2" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "4" })).not.toBeInTheDocument();
    });
});
