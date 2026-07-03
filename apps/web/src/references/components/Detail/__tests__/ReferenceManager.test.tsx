import { screen } from "@testing-library/react";
import {
	createFakeReference,
	mockApiGetReferenceDetail,
} from "@tests/fake/references";
import { renderRoute } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("<ReferenceManager />", () => {
	let reference: ReturnType<typeof createFakeReference>;
	let path: string;

	beforeEach(() => {
		reference = createFakeReference({
			cloned_from: { id: "source-ref", name: "Source Reference Name" },
		});
		path = `/refs/${reference.id}/manage`;
		mockApiGetReferenceDetail(reference);
	});

	afterEach(() => nock.cleanAll());

	it("should render properly", async () => {
		await renderRoute(path);

		expect(await screen.findByText("General")).toBeInTheDocument();
		expect(screen.getByText("Description")).toBeInTheDocument();
		expect(screen.getByText("Organism")).toBeInTheDocument();
		expect(screen.getByText("Latest Index Build")).toBeInTheDocument();
		expect(screen.getByText("No index builds found")).toBeInTheDocument();
		expect(screen.getByText("Contributors")).toBeInTheDocument();
		expect(screen.getByText("No contributors found")).toBeInTheDocument();
	});

	it("should render clone source when [cloned_from] is set", async () => {
		await renderRoute(path);

		expect(await screen.findByText("Clone Reference")).toBeInTheDocument();
		expect(screen.getByText("Source Reference"));
		expect(screen.getByText("Source Reference Name")).toBeInTheDocument();
	});
});
