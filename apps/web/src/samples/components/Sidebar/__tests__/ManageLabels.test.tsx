import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import ManageLabels from "../ManageLabels";

/**
 * Mocks the sample-update endpoint and captures the request body so tests can
 * assert which labels were sent for each selected sample.
 */
function mockApiUpdateSampleLabels(sampleId: string) {
	const captured: { body?: { labels: number[] } } = {};

	nock("http://localhost")
		.patch(`/api/samples/${sampleId}`)
		.reply(200, (_uri, body: { labels: number[] }) => {
			captured.body = body;
			return {};
		});

	return captured;
}

describe("<ManageLabels>", () => {
	let props;

	beforeEach(() => {
		props = {
			selectedSamples: [],
			labels: [
				{ color: "#C4B5FD", description: "", id: 1, name: "test" },
				{ color: "#FCA5A5", description: "", id: 2, name: "label" },
				{ color: "#1D4ED8", description: "", id: 3, name: "bar" },
			],
		};
	});

	it("should be disabled if no labels exist", async () => {
		props.labels = [];
		await renderWithRouter(<ManageLabels {...props} />);
		await waitFor(() =>
			expect(screen.queryByLabelText("loading")).not.toBeInTheDocument(),
		);

		expect(screen.getByText("Create one")).toBeInTheDocument();
	});

	it("should display labels of one selected sample", async () => {
		props.selectedSamples = [
			{
				name: "Foo Sample",
				id: "foo_sample",
				labels: [{ color: "#C4B5FD", description: "", id: 1, name: "test" }],
			},
		];
		await renderWithRouter(<ManageLabels {...props} />);
		await waitFor(() =>
			expect(screen.queryByLabelText("loading")).not.toBeInTheDocument(),
		);

		expect(screen.getByText("test")).toBeInTheDocument();
	});

	it("should display labels of two selected samples", async () => {
		props.selectedSamples = [
			{
				name: "Foo Sample",
				id: "foo_sample",
				labels: [{ color: "#C4B5FD", description: "", id: 1, name: "test" }],
			},
			{
				name: "Sample",
				id: "sample",
				labels: [{ color: "#FCA5A5", description: "", id: 2, name: "label" }],
			},
		];
		await renderWithRouter(<ManageLabels {...props} />);
		await waitFor(() =>
			expect(screen.queryByLabelText("loading")).not.toBeInTheDocument(),
		);

		expect(screen.getByText("test")).toBeInTheDocument();
		expect(screen.getByText("label")).toBeInTheDocument();
	});

	describe("toggling a label with mixed labels across the selection", () => {
		afterEach(() => nock.cleanAll());

		beforeEach(() => {
			// "test" (id 1) is on both samples, "label" (id 2) is on one only, so
			// the selection has labels in mixed states.
			props.selectedSamples = [
				{
					name: "Foo Sample",
					id: "foo_sample",
					labels: [
						{ color: "#C4B5FD", description: "", id: 1, name: "test" },
						{ color: "#FCA5A5", description: "", id: 2, name: "label" },
					],
				},
				{
					name: "Bar Sample",
					id: "bar_sample",
					labels: [{ color: "#C4B5FD", description: "", id: 1, name: "test" }],
				},
			];
		});

		async function openSelectorAndClick(labelName: string) {
			await renderWithRouter(<ManageLabels {...props} />);
			await waitFor(() =>
				expect(screen.queryByLabelText("loading")).not.toBeInTheDocument(),
			);

			await userEvent.click(
				screen.getByRole("button", { name: "select labels" }),
			);
			await userEvent.click(screen.getByRole("button", { name: labelName }));
		}

		it("removes a fully-applied label from every sample", async () => {
			const foo = mockApiUpdateSampleLabels("foo_sample");
			const bar = mockApiUpdateSampleLabels("bar_sample");

			await openSelectorAndClick("test");

			await waitFor(() => {
				expect(foo.body?.labels).toEqual([2]);
				expect(bar.body?.labels).toEqual([]);
			});
		});

		it("adds a partially-applied label to every sample", async () => {
			const foo = mockApiUpdateSampleLabels("foo_sample");
			const bar = mockApiUpdateSampleLabels("bar_sample");

			await openSelectorAndClick("label");

			await waitFor(() => {
				expect(foo.body?.labels).toEqual([1, 2]);
				expect(bar.body?.labels).toEqual([1, 2]);
			});
		});

		it("adds an unapplied label to every sample", async () => {
			const foo = mockApiUpdateSampleLabels("foo_sample");
			const bar = mockApiUpdateSampleLabels("bar_sample");

			await openSelectorAndClick("bar");

			await waitFor(() => {
				expect(foo.body?.labels).toEqual([1, 2, 3]);
				expect(bar.body?.labels).toEqual([1, 3]);
			});
		});
	});
});
