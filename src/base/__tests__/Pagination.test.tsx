import { formatPath } from "@app/hooks";
import { screen } from "@testing-library/react";
import { renderWithRouter } from "@tests/setup.js";
import { beforeEach, describe, expect, it } from "vitest";
import Pagination from "../Pagination";

describe("<Pagination />", () => {
	let props;
	let path;

	beforeEach(() => {
		props = {
			pageCount: 6,
			currentPage: 1,
			storedPage: 1,
		};
		path = formatPath("/samples/uploads", { page: 1 });
	});

	it("Should render correctly when pageCount=6 and currentPage=1", async () => {
		await renderWithRouter(<Pagination {...props} />, path);
		expect(screen.getByRole("link", { name: "Previous" })).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Go to next page" }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument();
		expect(screen.queryByRole("link", { name: "5" })).not.toBeInTheDocument();
		expect(screen.queryByRole("link", { name: "6" })).not.toBeInTheDocument();
	});

	it("should render correctly when pageCount=6 and currentPage = 3", async () => {
		props.storedPage = 3;
		await renderWithRouter(<Pagination {...props} />, path);
		expect(screen.getByRole("link", { name: "Previous" })).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Go to next page" }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "2" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "5" })).toBeInTheDocument();
		expect(screen.queryByRole("link", { name: "1" })).not.toBeInTheDocument();
		expect(screen.queryByRole("link", { name: "6" })).not.toBeInTheDocument();
	});

	it("should render correctly when pageCount=0", async () => {
		props.pageCount = 0;
		await renderWithRouter(<Pagination {...props} />, path);
		expect(
			screen.queryByRole("link", { name: "Previous" }),
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("link", { name: "Go to next page" }),
		).not.toBeInTheDocument();
		expect(screen.queryByRole("link", { name: "1" })).not.toBeInTheDocument();
		expect(screen.queryByRole("link", { name: "3" })).not.toBeInTheDocument();
	});

	it("should render correctly when pageCount=3", async () => {
		props.pageCount = 3;
		await renderWithRouter(<Pagination {...props} />, path);
		expect(screen.getByRole("link", { name: "Previous" })).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Go to next page" }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "2" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "3" })).toBeInTheDocument();
		expect(screen.queryByRole("link", { name: "4" })).not.toBeInTheDocument();
	});
});
