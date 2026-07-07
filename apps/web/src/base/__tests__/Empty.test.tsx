import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyMedia,
	EmptyTitle,
} from "../Empty";

describe("Empty", () => {
	it("should render its children", () => {
		render(
			<Empty>
				<EmptyTitle>No samples found</EmptyTitle>
			</Empty>,
		);
		expect(screen.getByText("No samples found")).toBeInTheDocument();
	});

	it("should merge a custom className onto the root", () => {
		const { container } = render(
			<Empty className="custom-class">
				<EmptyTitle>Nothing here</EmptyTitle>
			</Empty>,
		);
		expect(container.firstChild).toHaveClass("custom-class");
	});

	it("should stack vertically by default", () => {
		const { container } = render(
			<Empty>
				<EmptyTitle>Nothing here</EmptyTitle>
			</Empty>,
		);
		expect(container.firstChild).toHaveClass("flex-col");
	});

	it("should lay out in a row when horizontal", () => {
		const { container } = render(
			<Empty orientation="horizontal">
				<EmptyTitle>Nothing here</EmptyTitle>
			</Empty>,
		);
		expect(container.firstChild).toHaveClass("flex-row");
	});

	it("should hide the media from assistive technology", () => {
		render(
			<Empty>
				<EmptyMedia>
					<svg data-testid="icon" />
				</EmptyMedia>
				<EmptyTitle>No results</EmptyTitle>
			</Empty>,
		);
		expect(screen.getByTestId("icon").parentElement).toHaveAttribute(
			"aria-hidden",
			"true",
		);
	});

	it("should render a description", () => {
		render(
			<Empty>
				<EmptyTitle>No labels found</EmptyTitle>
				<EmptyDescription>Create one to get started</EmptyDescription>
			</Empty>,
		);
		expect(screen.getByText("Create one to get started")).toBeInTheDocument();
	});

	it("should render an action in the content slot", () => {
		render(
			<Empty>
				<EmptyTitle>Something went wrong</EmptyTitle>
				<EmptyContent>
					<button type="button">Try again</button>
				</EmptyContent>
			</Empty>,
		);
		expect(
			screen.getByRole("button", { name: "Try again" }),
		).toBeInTheDocument();
	});
});
