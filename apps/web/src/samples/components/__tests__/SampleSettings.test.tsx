import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeSettings } from "@tests/fake/administrator";
import { mockGetSettings, mockUpdateSettings } from "@tests/server-fn/settings";
import { renderWithProviders } from "@tests/setup";
import { beforeEach, describe, expect, it } from "vitest";
import SampleSettings from "../SampleSettings";

describe("<SampleSettings />", () => {
	beforeEach(() => {
		// The rights start denied so that selecting "Read & write" is always a
		// change. Left to the fake's random booleans, they can start as read &
		// write, making the click a no-op and the expected update never fire.
		mockGetSettings(
			createFakeSettings({
				sample_all_read: false,
				sample_all_write: false,
				sample_group_read: false,
				sample_group_write: false,
			}),
		);
	});

	it("should render", async () => {
		renderWithProviders(<SampleSettings />);

		await waitFor(() =>
			expect(screen.getByText("Sample Settings")).toBeInTheDocument(),
		);

		expect(screen.getByText("Sample Group")).toBeInTheDocument();
		expect(screen.getByRole("radio", { name: /None/ })).toBeInTheDocument();
		expect(
			screen.getByRole("radio", { name: /Force choice/ }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("radio", { name: /User's primary group/ }),
		).toBeInTheDocument();
		expect(screen.getByText("Group Rights")).toBeInTheDocument();
		expect(screen.getByLabelText("Group Rights")).toBeInTheDocument();
		expect(screen.getByText("All Users' Rights")).toBeInTheDocument();
		expect(screen.getByLabelText("All Users' Rights")).toBeInTheDocument();
	});

	it("should update settings when force choice is selected", async () => {
		const settings = createFakeSettings({ sample_group: "force_choice" });
		const updateSettings = mockUpdateSettings(settings);
		renderWithProviders(<SampleSettings />);

		await waitFor(() =>
			expect(screen.getByText("Sample Settings")).toBeInTheDocument(),
		);
		await userEvent.click(screen.getByRole("radio", { name: /Force choice/ }));

		expect(updateSettings).toHaveBeenCalledWith({
			data: { sample_group: "force_choice" },
		});
	});

	it("should update settings when users primary group is selected", async () => {
		const settings = createFakeSettings({
			sample_group: "users_primary_group",
		});
		const updateSettings = mockUpdateSettings(settings);
		renderWithProviders(<SampleSettings />);

		await waitFor(() =>
			expect(screen.getByText("Sample Settings")).toBeInTheDocument(),
		);
		await userEvent.click(
			screen.getByRole("radio", { name: /User's primary group/ }),
		);

		expect(updateSettings).toHaveBeenCalledWith({
			data: { sample_group: "users_primary_group" },
		});
	});

	it("should update settings when group rights change", async () => {
		const settings = createFakeSettings({
			sample_group_read: true,
			sample_group_write: true,
		});
		const updateSettings = mockUpdateSettings(settings);
		renderWithProviders(<SampleSettings />);

		await waitFor(() =>
			expect(screen.getByText("Sample Settings")).toBeInTheDocument(),
		);
		await userEvent.click(screen.getByLabelText("Group Rights"));
		await userEvent.click(screen.getByRole("option", { name: "Read & write" }));

		expect(updateSettings).toHaveBeenCalledWith({
			data: { sample_group_read: true, sample_group_write: true },
		});
	});

	it("should update settings when all users rights change", async () => {
		const settings = createFakeSettings({
			sample_all_read: true,
			sample_all_write: true,
		});
		const updateSettings = mockUpdateSettings(settings);
		renderWithProviders(<SampleSettings />);

		await waitFor(() =>
			expect(screen.getByText("Sample Settings")).toBeInTheDocument(),
		);
		await userEvent.click(screen.getByLabelText("All Users' Rights"));
		await userEvent.click(screen.getByRole("option", { name: "Read & write" }));

		expect(updateSettings).toHaveBeenCalledWith({
			data: { sample_all_read: true, sample_all_write: true },
		});
	});
});
