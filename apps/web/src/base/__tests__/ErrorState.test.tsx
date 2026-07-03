import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ErrorState from "../ErrorState";

describe("ErrorState", () => {
	it("should render the default message", () => {
		render(<ErrorState />);
		expect(screen.getByText("Something went wrong")).toBeInTheDocument();
	});

	it("should render a custom message", () => {
		render(<ErrorState message="Couldn't load samples" />);
		expect(screen.getByText("Couldn't load samples")).toBeInTheDocument();
	});

	it("should apply the default red icon color", () => {
		const { container } = render(<ErrorState />);
		expect(container.querySelector("svg")).toHaveClass("text-red-500");
	});

	it("should apply the requested palette color to the icon", () => {
		const { container } = render(<ErrorState color="orange" />);
		expect(container.querySelector("svg")).toHaveClass("text-orange-500");
	});

	it("should hide the decorative default icon from assistive tech", () => {
		const { container } = render(<ErrorState />);
		expect(container.querySelector("svg")).toHaveAttribute(
			"aria-hidden",
			"true",
		);
	});

	it("should render a custom icon in place of the default", () => {
		const { container } = render(
			<ErrorState icon={<svg data-testid="custom-icon" />} />,
		);
		expect(
			container.querySelector('[data-testid="custom-icon"]'),
		).toBeInTheDocument();
		expect(
			container.querySelector(".lucide-circle-alert"),
		).not.toBeInTheDocument();
	});

	it("should render children as the action", () => {
		render(
			<ErrorState>
				<button type="button">Try again</button>
			</ErrorState>,
		);
		expect(
			screen.getByRole("button", { name: "Try again" }),
		).toBeInTheDocument();
	});

	it("should merge a custom className", () => {
		const { container } = render(<ErrorState className="custom-class" />);
		expect(container.firstChild).toHaveClass("custom-class");
	});
});
