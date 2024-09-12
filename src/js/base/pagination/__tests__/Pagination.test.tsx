import { Pagination } from "@base";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup.js";
import React from "react";
import { MemoryRouter } from "react-router-dom";
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
        renderWithProviders(
            <MemoryRouter initialEntries={[{ pathname: "/samples/files", search: "?page=1" }]}>
                <Pagination {...props} />
            </MemoryRouter>,
        );
        expect(screen.getByRole("link", { name: "Previous" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Next" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "5" })).not.toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "6" })).not.toBeInTheDocument();
    });

    it("should render correctly when pageCount=6 and currentPage = 3", () => {
        props.storedPage = 3;
        renderWithProviders(
            <MemoryRouter initialEntries={[{ pathname: "/samples/files", search: "?page=1" }]}>
                <Pagination {...props} />
            </MemoryRouter>,
        );
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
        renderWithProviders(
            <MemoryRouter initialEntries={[{ pathname: "/samples/files", search: "?page=1" }]}>
                <Pagination {...props} />
            </MemoryRouter>,
        );
        expect(screen.queryByRole("link", { name: "Previous" })).not.toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "Next" })).not.toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "1" })).not.toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "3" })).not.toBeInTheDocument();
    });

    it("should render correctly when pageCount=3", () => {
        props.pageCount = 3;
        renderWithProviders(
            <MemoryRouter initialEntries={[{ pathname: "/samples/files", search: "?page=1" }]}>
                <Pagination {...props} />
            </MemoryRouter>,
        );
        expect(screen.getByRole("link", { name: "Previous" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Next" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "2" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "4" })).not.toBeInTheDocument();
    });
});
