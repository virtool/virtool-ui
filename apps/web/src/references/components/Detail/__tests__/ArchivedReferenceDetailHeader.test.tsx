import { screen } from "@testing-library/react";
import { mockApiGetAccount } from "@tests/api/account";
import { createFakeAccount } from "@tests/fake/account";
import {
	createFakeReference,
	mockApiGetReferenceDetail,
} from "@tests/fake/references";
import { renderWithRouter } from "@tests/setup";
import { beforeEach, describe, expect, it } from "vitest";
import ArchivedReferenceDetailHeader from "../ArchivedReferenceDetailHeader";

describe("<ArchivedReferenceDetailHeader />", () => {
	let props;
	let reference;
	let path;

	beforeEach(() => {
		reference = createFakeReference({ archived: true });
		mockApiGetReferenceDetail(reference);
		mockApiGetAccount(
			createFakeAccount({
				administrator_role: "full",
			}),
		);
		props = {
			createdAt: reference.created_at,
			isRemote: false,
			name: reference.name,
			userHandle: reference.user.handle,
			refId: reference.id,
		};
		path = `/refs/${reference.id}/manage`;
	});

	it("should render the name, attribution, and Archived badge", async () => {
		await renderWithRouter(<ArchivedReferenceDetailHeader {...props} />, path);

		expect(screen.getByText(reference.name)).toBeInTheDocument();
		expect(
			screen.getByText(`${reference.user.handle} created`),
		).toBeInTheDocument();
		expect(screen.getByText("Archived")).toBeInTheDocument();
	});

	it("should render the unarchive button when [canModify=true]", async () => {
		await renderWithRouter(<ArchivedReferenceDetailHeader {...props} />, path);

		expect(
			await screen.findByRole("button", { name: "unarchive" }),
		).toBeInTheDocument();
	});

	it("should not render the unarchive button when [canModify=false]", async () => {
		mockApiGetAccount(createFakeAccount({ administrator_role: null }));
		await renderWithRouter(<ArchivedReferenceDetailHeader {...props} />, path);

		expect(screen.queryByRole("button", { name: "unarchive" })).toBeNull();
	});

	it("should show the lock and hide the unarchive button when [isRemote=true]", async () => {
		props.isRemote = true;
		await renderWithRouter(<ArchivedReferenceDetailHeader {...props} />, path);

		expect(await screen.findByLabelText("lock")).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "unarchive" })).toBeNull();
	});
});
