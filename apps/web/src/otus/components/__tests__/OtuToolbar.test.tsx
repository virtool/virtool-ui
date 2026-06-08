import { screen } from "@testing-library/react";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import {
	createFakeReference,
	mockApiGetReferenceDetail,
} from "@tests/fake/references";
import { renderWithProviders } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import OtuToolbar from "../OtuToolbar";

describe("<OtuToolbar />", () => {
	let reference: ReturnType<typeof createFakeReference>;

	beforeEach(() => {
		reference = createFakeReference();
		mockApiGetReferenceDetail(reference);
	});

	afterEach(() => nock.cleanAll());

	it("should render Create button when [canCreate=true]", async () => {
		mockApiGetAccount(createFakeAccount({ administrator_role: "full" }));

		renderWithProviders(
			<OtuToolbar
				term=""
				setTerm={vi.fn()}
				onCreate={vi.fn()}
				refId={reference.id}
				remotesFrom={null}
			/>,
		);

		expect(
			await screen.findByRole("button", { name: "Create" }),
		).toBeInTheDocument();
	});

	it("should not render Create button when [canCreate=false]", async () => {
		mockApiGetAccount(createFakeAccount({ administrator_role: null }));

		renderWithProviders(
			<OtuToolbar
				term=""
				setTerm={vi.fn()}
				onCreate={vi.fn()}
				refId={reference.id}
				remotesFrom={null}
			/>,
		);

		expect(await screen.findByRole("textbox")).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "Create" })).toBeNull();
	});
});
