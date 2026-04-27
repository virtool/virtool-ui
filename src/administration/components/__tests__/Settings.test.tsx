import { screen } from "@testing-library/react";
import { createFakeAccount } from "@tests/fake/account";
import {
	createFakeSettings,
	mockApiGetSettings,
} from "@tests/fake/administrator";
import { renderRoute } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("<Settings />", () => {
	let path;

	beforeEach(() => {
		mockApiGetSettings(createFakeSettings());
		path = "/administration/settings";
	});

	afterEach(() => nock.cleanAll());

	it("should render", async () => {
		const account = createFakeAccount({ administrator_role: "full" });
		await renderRoute(path, { account });

		expect(await screen.findByText("Instance Message")).toBeInTheDocument();
		expect(screen.getByText("Settings")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
		expect(
			screen.getByRole("textbox", { name: "Message" }),
		).toBeInTheDocument();

		expect(screen.getByText("JSON API")).toBeInTheDocument();
	});

	it("should render all options for full administrators", async () => {
		const account = createFakeAccount({ administrator_role: "full" });
		await renderRoute(path, { account });

		expect(await screen.findByText("Users")).toBeInTheDocument();
		expect(screen.getByText("Settings")).toBeInTheDocument();
		expect(screen.getByText("Administrators")).toBeInTheDocument();
		expect(screen.getByText("Groups")).toBeInTheDocument();
	});

	it("should render only groups and users for users administrators", async () => {
		const account = createFakeAccount({ administrator_role: "users" });
		await renderRoute(path, { account });

		expect(await screen.findByText("Users")).toBeInTheDocument();
		expect(screen.queryByText("Settings")).not.toBeInTheDocument();
		expect(screen.queryByText("Administrators")).not.toBeInTheDocument();
		expect(screen.getByText("Groups")).toBeInTheDocument();
	});
});
