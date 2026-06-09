import { screen } from "@testing-library/react";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import {
	createFakeReference,
	mockApiGetReferenceDetail,
} from "@tests/fake/references";
import { renderWithRouter } from "@tests/setup";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import ReferenceDetailHeader from "../ReferenceDetailHeader";

describe("<ReferenceDetailHeaderIcon />", () => {
	let props: ComponentProps<typeof ReferenceDetailHeader>;
	let reference: ReturnType<typeof createFakeReference>;
	let path: string;

	beforeEach(() => {
		reference = createFakeReference();
		mockApiGetReferenceDetail(reference);
		mockApiGetAccount(
			createFakeAccount({
				administrator_role: "full",
			}),
		);
		props = {
			createdAt: reference.created_at,
			detail: reference,
			isRemote: false,
			name: reference.name,
			userHandle: reference.user.handle,
			refId: reference.id,
		};
		path = `/refs/${reference.id}/manage`;
	});

	it("should render", async () => {
		await renderWithRouter(<ReferenceDetailHeader {...props} />, path);

		expect(screen.getByText(reference.name)).toBeInTheDocument();
		expect(
			screen.getByText(`${reference.user.handle} created`),
		).toBeInTheDocument();
	});

	it("should render when [showIcons=false]", async () => {
		await renderWithRouter(<ReferenceDetailHeader {...props} />, path);

		expect(screen.queryByLabelText("lock")).toBeNull();
		expect(screen.queryByRole("button")).toBeNull();
	});

	it("should render when [canModify=true]", async () => {
		await renderWithRouter(<ReferenceDetailHeader {...props} />, path);

		expect(
			await screen.findByRole("button", { name: "modify" }),
		).toBeInTheDocument();
	});

	it("should render when [canModify=false]", async () => {
		await renderWithRouter(<ReferenceDetailHeader {...props} />, path);

		expect(screen.queryByRole("button")).toBeNull();
	});

	it("should render when [isRemote=true]", async () => {
		props.isRemote = true;
		mockApiGetAccount(
			createFakeAccount({
				administrator_role: "full",
			}),
		);
		await renderWithRouter(<ReferenceDetailHeader {...props} />, path);

		expect(await screen.findByLabelText("lock")).toBeInTheDocument();
	});

	it("should render when [isRemote=false]", async () => {
		mockApiGetAccount(
			createFakeAccount({
				administrator_role: "full",
			}),
		);
		await renderWithRouter(<ReferenceDetailHeader {...props} />, path);

		expect(screen.queryByLabelText("lock")).toBeNull();
	});

	it("should render when [both canModify=false, isRemote=false]", async () => {
		mockApiGetAccount(createFakeAccount({ administrator_role: null }));
		await renderWithRouter(<ReferenceDetailHeader {...props} />, path);

		expect(screen.queryByLabelText("lock")).toBeNull();
		expect(screen.queryByRole("button")).toBeNull();
	});

	it("should render the archive button when [canModify=true]", async () => {
		await renderWithRouter(<ReferenceDetailHeader {...props} />, path);

		expect(
			await screen.findByRole("button", { name: "archive" }),
		).toBeInTheDocument();
		expect(screen.queryByText("Archived")).toBeNull();
	});

	it("should not render the archive button when [canModify=false]", async () => {
		mockApiGetAccount(createFakeAccount({ administrator_role: null }));
		await renderWithRouter(<ReferenceDetailHeader {...props} />, path);

		expect(screen.queryByRole("button", { name: "archive" })).toBeNull();
	});
});
