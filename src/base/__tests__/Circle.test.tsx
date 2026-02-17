import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import Circle from "../Circle";

describe("Circle", () => {
    it("should render with correct size", () => {
        const { container } = render(<Circle size={20} />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("width", "20");
        expect(svg).toHaveAttribute("height", "20");
    });

    it("should render with correct color class", () => {
        const { container } = render(<Circle color="red" />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveClass("text-red-500");
    });

    it("should render with custom className", () => {
        const { container } = render(<Circle className="custom-class" />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveClass("custom-class");
    });

    it("should pass additional props to svg", () => {
        const { container } = render(<Circle aria-label="test-circle" />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("aria-label", "test-circle");
    });

    it("should render full fill by default", () => {
        const { container } = render(<Circle />);
        expect(container.querySelector("circle")).toBeInTheDocument();
        expect(container.querySelector("circle")).toHaveAttribute("fill", "currentColor");
    });

    it("should render half fill", () => {
        const { container } = render(<Circle fill="half" />);
        expect(container.querySelector("path")).toBeInTheDocument();
        expect(container.querySelector("path")).toHaveAttribute("d", "M 5 0.5 A 4.5 4.5 0 0 0 5 9.5 Z");
        expect(container.querySelector("circle")).toBeInTheDocument();
        expect(container.querySelector("circle")).toHaveAttribute("fill", "none");
    });

    it("should render empty fill", () => {
        const { container } = render(<Circle fill="empty" />);
        const circle = container.querySelector("circle");
        expect(circle).toBeInTheDocument();
        expect(circle).toHaveAttribute("fill", "none");
        expect(circle).toHaveAttribute("stroke", "currentColor");
    });
});
