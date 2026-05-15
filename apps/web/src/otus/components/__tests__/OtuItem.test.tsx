import { screen } from "@testing-library/react";
import { createFakeOTUMinimal } from "@tests/fake/otus";
import { renderWithRouter } from "@tests/setup";
import { describe, expect, it } from "vitest";
import OtuItem from "../OtuItem";

describe("<OtuItem />", () => {
	it("should not render 'Unverified' when [verified=true]", async () => {
		const otu = createFakeOTUMinimal({ verified: true });

		await renderWithRouter(<OtuItem {...otu} refId="ref-1" />);

		expect(screen.getByText(otu.name)).toBeInTheDocument();
		expect(screen.getByText(otu.abbreviation)).toBeInTheDocument();
		expect(screen.queryByText("Unverified")).toBeNull();
	});

	it("should render 'Unverified' when [verified=false]", async () => {
		const otu = createFakeOTUMinimal({ verified: false });

		await renderWithRouter(<OtuItem {...otu} refId="ref-1" />);

		expect(screen.getByText("Unverified")).toBeInTheDocument();
	});
});
