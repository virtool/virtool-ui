import { render, screen } from "@testing-library/react";
import { Pencil } from "lucide-react";
import { describe, expect, it } from "vitest";
import IconButton from "../IconButton";

describe("IconButton", () => {
	it("renders the gray variant at text-gray-500 so it meets non-text contrast", () => {
		render(<IconButton IconComponent={Pencil} color="gray" tip="edit" />);
		const button = screen.getByRole("button", { name: "edit" });
		expect(button).toHaveClass("text-gray-500");
		expect(button).not.toHaveClass("text-gray-400");
	});

	it("defaults to the black variant", () => {
		render(<IconButton IconComponent={Pencil} tip="edit" />);
		expect(screen.getByRole("button", { name: "edit" })).toHaveClass(
			"text-black",
		);
	});

	it("uses a white icon and focus ring on a dark background", () => {
		render(<IconButton IconComponent={Pencil} tip="About" onDark />);
		const button = screen.getByRole("button", { name: "About" });
		expect(button).toHaveClass("text-white");
		expect(button).toHaveClass("focus-visible:ring-white");
	});
});
