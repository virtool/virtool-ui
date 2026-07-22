import { screen } from "@testing-library/react";
import { createFakeUser } from "@tests/fake/user";
import { mockSearchUsers } from "@tests/server-fn/users";
import { renderWithProviders } from "@tests/setup";
import { describe, expect, it } from "vitest";
import AddReferenceUser from "../AddReferenceUser";

describe("<AddReferenceUser />", () => {
	it("lists users returned by the search", async () => {
		const alice = createFakeUser({ handle: "alice" });
		const bob = createFakeUser({ handle: "bob" });
		mockSearchUsers([alice, bob]);

		renderWithProviders(
			<AddReferenceUser
				users={[]}
				onHide={() => undefined}
				refId="ref-1"
				show
			/>,
		);

		expect(await screen.findByText("alice")).toBeInTheDocument();
		expect(screen.getByText("bob")).toBeInTheDocument();
	});

	it("omits users already members of the reference", async () => {
		const alice = createFakeUser({ handle: "alice" });
		const bob = createFakeUser({ handle: "bob" });
		mockSearchUsers([alice, bob]);

		renderWithProviders(
			<AddReferenceUser
				users={[
					{
						id: alice.id,
						handle: alice.handle,
						build: false,
						modify: false,
						modify_otu: false,
						remove: false,
						created_at: "",
					},
				]}
				onHide={() => undefined}
				refId="ref-1"
				show
			/>,
		);

		expect(await screen.findByText("bob")).toBeInTheDocument();
		expect(screen.queryByText("alice")).not.toBeInTheDocument();
	});
});
