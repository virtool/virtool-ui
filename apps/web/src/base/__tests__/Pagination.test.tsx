import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup.js";
import { beforeEach, describe, expect, it } from "vitest";
import Pagination from "../Pagination";

type PaginationTestProps = {
	currentPage: number;
	items: object[];
	pageCount: number;
	storedPage: number;
};

describe("<Pagination />", () => {
	let props: PaginationTestProps;

	beforeEach(() => {
		props = {
			pageCount: 6,
			currentPage: 1,
			items: [],
			storedPage: 1,
		};
	});

	it("Should render correctly when pageCount=6 and currentPage=1", async () => {
		renderWithProviders(<Pagination {...props} />);
		expect(
			screen.getByRole("button", { name: "Go to previous page" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Go to next page" }),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "5" })).not.toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "6" })).not.toBeInTheDocument();
	});

	it("should render correctly when pageCount=6 and currentPage = 3", async () => {
		props.storedPage = 3;
		renderWithProviders(<Pagination {...props} />);
		expect(
			screen.getByRole("button", { name: "Go to previous page" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Go to next page" }),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "1" })).not.toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "6" })).not.toBeInTheDocument();
	});

	it("should render correctly when pageCount=0", async () => {
		props.pageCount = 0;
		renderWithProviders(<Pagination {...props} />);
		expect(
			screen.queryByRole("button", { name: "Previous" }),
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "Go to next page" }),
		).not.toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "1" })).not.toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "3" })).not.toBeInTheDocument();
	});

	it("should render correctly when pageCount=3", async () => {
		props.pageCount = 3;
		renderWithProviders(<Pagination {...props} />);
		expect(
			screen.getByRole("button", { name: "Go to previous page" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Go to next page" }),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "4" })).not.toBeInTheDocument();
	});
});
