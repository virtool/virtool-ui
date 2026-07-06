import { formatIsolateName } from "@app/utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeOTUIsolate } from "@tests/fake/otus";
import { renderWithRouter } from "@tests/setup";
import { describe, expect, it, vi } from "vitest";
import IsolateItem from "../IsolateItem";

describe("<IsolateItem />", () => {
	it("should render the isolate name", async () => {
		const isolate = createFakeOTUIsolate();

		await renderWithRouter(
			<IsolateItem
				isolate={isolate}
				refId="ref-1"
				otuId="otu-1"
				canRemove
				onRemove={vi.fn()}
			/>,
		);

		expect(screen.getByText(formatIsolateName(isolate))).toBeInTheDocument();
	});

	it("should link to the isolate detail route", async () => {
		const isolate = createFakeOTUIsolate();

		await renderWithRouter(
			<IsolateItem
				isolate={isolate}
				refId="ref-1"
				otuId="otu-1"
				canRemove
				onRemove={vi.fn()}
			/>,
		);

		expect(
			screen.getByRole("link", { name: formatIsolateName(isolate) }),
		).toHaveAttribute("href", `/refs/ref-1/otus/otu-1/isolates/${isolate.id}`);
	});

	it("should render a default indicator when [isolate.default=true]", async () => {
		const isolate = { ...createFakeOTUIsolate(), default: true };

		const { container } = await renderWithRouter(
			<IsolateItem
				isolate={isolate}
				refId="ref-1"
				otuId="otu-1"
				canRemove
				onRemove={vi.fn()}
			/>,
		);

		expect(container.querySelector(".lucide-star")).not.toBeNull();
	});

	it("should not render a default indicator when [isolate.default=false]", async () => {
		const isolate = { ...createFakeOTUIsolate(), default: false };

		const { container } = await renderWithRouter(
			<IsolateItem
				isolate={isolate}
				refId="ref-1"
				otuId="otu-1"
				canRemove
				onRemove={vi.fn()}
			/>,
		);

		expect(container.querySelector(".lucide-star")).toBeNull();
	});

	it("should call onRemove with the isolate when the remove button is clicked", async () => {
		const isolate = createFakeOTUIsolate();
		const onRemove = vi.fn();

		await renderWithRouter(
			<IsolateItem
				isolate={isolate}
				refId="ref-1"
				otuId="otu-1"
				canRemove
				onRemove={onRemove}
			/>,
		);

		await userEvent.click(
			screen.getByRole("button", { name: "remove isolate" }),
		);

		expect(onRemove).toHaveBeenCalledWith(isolate);
	});

	it("should not render a remove button when [canRemove=false]", async () => {
		const isolate = createFakeOTUIsolate();

		await renderWithRouter(
			<IsolateItem
				isolate={isolate}
				refId="ref-1"
				otuId="otu-1"
				canRemove={false}
				onRemove={vi.fn()}
			/>,
		);

		expect(screen.queryByRole("button")).toBeNull();
	});
});
