import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockAddIsolate } from "@tests/server-fn/otus";
import { renderWithProviders } from "@tests/setup";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddIsolate from "../AddIsolate";

describe("<AddIsolate />", () => {
	let props: ComponentProps<typeof AddIsolate>;

	beforeEach(() => {
		props = {
			allowedSourceTypes: ["isolate", "genotype"],
			restrictSourceTypes: true,
			otuId: "test",
			show: true,
			onHide: vi.fn(),
		};
	});

	it("should render properly", () => {
		renderWithProviders(<AddIsolate {...props} />);

		expect(screen.getByText("Add Isolate")).toBeInTheDocument();
		expect(screen.getByText("Source Type")).toBeInTheDocument();
		expect(screen.getByText("Source Name")).toBeInTheDocument();
		expect(screen.getByText("Isolate Name")).toBeInTheDocument();
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	describe("<IsolateForm />", () => {
		it("should render with source types restricted", async () => {
			renderWithProviders(<AddIsolate {...props} />);

			await userEvent.click(screen.getByLabelText("Source Type"));

			expect(
				screen.getByRole("option", { name: "Unknown" }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("option", { name: "Isolate" }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("option", { name: "Genotype" }),
			).toBeInTheDocument();
		});

		it("should render with source types unrestricted", () => {
			props.restrictSourceTypes = false;
			renderWithProviders(<AddIsolate {...props} />);

			expect(
				screen.getByRole("textbox", { name: "Source Type" }),
			).toBeInTheDocument();
			expect(screen.queryByRole("combobox")).toBeNull();
		});

		it.each([
			["Genotype", "A"],
			["unknown", ""],
		])(
			"should handle submit when source type changes to %p",
			async (sourceType, sourceName) => {
				const addIsolate = mockAddIsolate({ sourceName, sourceType });
				renderWithProviders(<AddIsolate {...props} />);

				await userEvent.click(screen.getByLabelText("Source Type"));
				await userEvent.click(
					screen.getByRole("option", {
						name: new RegExp(`^${sourceType}$`, "i"),
					}),
				);

				if (sourceName) {
					await userEvent.type(
						screen.getByRole("textbox", { name: "Source Name" }),
						`${sourceName}`,
					);
				}

				await userEvent.click(screen.getByRole("button", { name: "Save" }));

				await waitFor(() =>
					expect(addIsolate).toHaveBeenCalledWith({
						data: {
							otuId: props.otuId,
							default: false,
							sourceName,
							sourceType,
						},
					}),
				);
			},
		);

		it("should handle submit with unrestricted source types", async () => {
			props.restrictSourceTypes = false;
			const addIsolate = mockAddIsolate({
				sourceName: "testName",
				sourceType: "Test type",
			});
			renderWithProviders(<AddIsolate {...props} />);

			await userEvent.type(
				screen.getByRole("textbox", { name: "Source Type" }),
				"Test type",
			);
			await userEvent.type(
				screen.getByRole("textbox", { name: "Source Name" }),
				"testName",
			);
			expect(screen.getByRole("textbox", { name: "Isolate Name" })).toHaveValue(
				"Test type testName",
			);

			await userEvent.click(screen.getByRole("button"));

			await waitFor(() =>
				expect(addIsolate).toHaveBeenCalledWith({
					data: {
						otuId: props.otuId,
						default: false,
						sourceName: "testName",
						sourceType: "Test type",
					},
				}),
			);
		});
	});
});
