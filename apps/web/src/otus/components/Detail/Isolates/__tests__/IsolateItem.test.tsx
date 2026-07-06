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
