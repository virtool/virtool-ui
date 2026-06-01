import type { ServerJob } from "@jobs/types";
import { screen } from "@testing-library/react";
import { mockApiGetJob } from "@tests/api/jobs";
import { createFakeIndexMinimal } from "@tests/fake/indexes";
import { createFakeReferenceNested } from "@tests/fake/references";
import { renderRoute } from "@tests/setup";
import nock from "nock";
import { afterEach, describe, expect, it } from "vitest";

function createBuildIndexJob(indexId: string): ServerJob {
	return {
		args: { index_id: indexId },
		id: 123,
		created_at: "2022-12-22T21:37:49.429000Z",
		finished_at: "2022-12-22T21:38:49.429000Z",
		progress: 100,
		state: "succeeded",
		steps: null,
		user: { id: 7, handle: "bob" },
		workflow: "build_index",
	};
}

describe("<JobDetail /> build_index links", () => {
	afterEach(() => nock.cleanAll());

	it("derives the reference id from the index so both links resolve", async () => {
		const refId = "reference-1";
		const indexId = "index-1";

		const scope = mockApiGetJob(123, createBuildIndexJob(indexId));
		nock("http://localhost")
			.get(`/api/indexes/${indexId}`)
			.reply(
				200,
				createFakeIndexMinimal({
					id: indexId,
					reference: createFakeReferenceNested({ id: refId }),
				}),
			);

		await renderRoute("/jobs/123");

		const referenceLink = await screen.findByRole("link", { name: refId });
		expect(referenceLink).toHaveAttribute("href", `/refs/${refId}`);

		const indexLink = screen.getByRole("link", { name: indexId });
		expect(indexLink).toHaveAttribute(
			"href",
			`/refs/${refId}/indexes/${indexId}`,
		);

		scope.done();
	});
});
