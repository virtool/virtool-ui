import { screen } from "@testing-library/react";
import { renderWithRouter } from "@tests/setup";
import { beforeEach, describe, expect, it } from "vitest";
import type { SubtractionMinimal } from "@/subtraction/types";
import { createFakeUserNested } from "@/tests/fake/user";
import { SubtractionItem } from "../SubtractionItem";

describe("<SubtractionItem />", () => {
	let props: SubtractionMinimal | undefined;

	beforeEach(() => {
		const createdAt = new Date();

		createdAt.setFullYear(new Date().getFullYear() - 1);

		props = {
			id: "foo",
			created_at: createdAt.toISOString(),
			file: {
				id: 23,
				name: "subtraction.fa.gz",
			},
			job: {
				id: "foobar",
				created_at: createdAt.toISOString(),
				progress: 50,
				state: "running",
				workflow: "create_subtraction",
				user: createFakeUserNested(),
			},
			name: "Arabidopsis thaliana",
			nickname: "Thale cress",
			ready: false,
			user: createFakeUserNested(),
		};
	});

	it("should render", async () => {
		await renderWithRouter(<SubtractionItem {...props} />);

		expect(screen.getByText("Arabidopsis thaliana")).toBeInTheDocument();
		expect(screen.getByRole("progressbar")).toHaveAttribute("data-value", "50");
	});

	it.each([
		"waiting",
		"running",
		"error",
	] as const)("should render progress bar for ", async (state) => {
		props.job.state = state;

		await renderWithRouter(<SubtractionItem {...props} />);
		expect(screen.getByRole("progressbar")).toBeInTheDocument();
	});

	it("should not render progress bar if job is ready", async () => {
		props.ready = true;

		await renderWithRouter(<SubtractionItem {...props} />);

		expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
		expect(screen.queryByText("Complete")).not.toBeInTheDocument();
		expect(
			screen.getByText(`${props.user.handle} created`),
		).toBeInTheDocument();
		expect(screen.getByText("1 year ago")).toBeInTheDocument();
	});

	it("should correctly render subtractions where jobs=null", async () => {
		props.job = null;
		props.ready = false;

		await renderWithRouter(<SubtractionItem {...props} />);
	});
});
