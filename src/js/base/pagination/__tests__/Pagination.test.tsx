import { Pagination } from "@base";
import { screen } from "@testing-library/react";
import { renderWithRouter } from "@tests/setup.jsx";
import { formatPath } from "@utils/hooks";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("<Pagination />", () => {
    let props;
    let path;

    beforeEach(() => {
        props = {
            pageCount: 6,
            currentPage: 1,
            storedPage: 1,
            onLoadNextPage: vi.fn(),
        };
        path = formatPath("/samples/files", { page: 1 });
    });

    it("Should render correctly when pageCount=6 and currentPage=1", () => {
        renderWithRouter(<Pagination {...props} />, path);
        expect(
            screen.getByRole("link", { name: "Previous" }),
        ).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Next" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument();
        expect(
            screen.queryByRole("link", { name: "5" }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("link", { name: "6" }),
        ).not.toBeInTheDocument();
    });

    it("should render correctly when pageCount=6 and currentPage = 3", () => {
        props.storedPage = 3;
        renderWithRouter(<Pagination {...props} />, path);
        expect(
            screen.getByRole("link", { name: "Previous" }),
        ).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Next" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "2" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "5" })).toBeInTheDocument();
        expect(
            screen.queryByRole("link", { name: "1" }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("link", { name: "6" }),
        ).not.toBeInTheDocument();
    });

    it("should render correctly when pageCount=0", () => {
        props.pageCount = 0;
        renderWithRouter(<Pagination {...props} />, path);
        expect(
            screen.queryByRole("link", { name: "Previous" }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("link", { name: "Next" }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("link", { name: "1" }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("link", { name: "3" }),
        ).not.toBeInTheDocument();
    });

    it("should render correctly when pageCount=3", () => {
        props.pageCount = 3;
        renderWithRouter(<Pagination {...props} />, path);
        expect(
            screen.getByRole("link", { name: "Previous" }),
        ).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Next" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "2" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument();
        expect(
            screen.queryByRole("link", { name: "4" }),
        ).not.toBeInTheDocument();
    });
});
