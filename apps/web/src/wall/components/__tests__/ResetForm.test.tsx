import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import { afterEach, describe, expect, it, vi } from "vitest";

const { navigateMock, resetPasswordMock } = vi.hoisted(() => ({
	navigateMock: vi.fn(),
	resetPasswordMock: vi.fn(),
}));

vi.mock("../../queries", async () => {
	const { useMutation } = await import("@tanstack/react-query");
	return {
		useResetPasswordMutation: () =>
			useMutation({
				mutationFn: resetPasswordMock,
			}),
	};
});

vi.mock("@tanstack/react-router", async (importOriginal) => ({
	...(await importOriginal<typeof import("@tanstack/react-router")>()),
	useNavigate: () => navigateMock,
}));

import ResetForm from "../ResetForm";

describe("<ResetForm />", () => {
	afterEach(() => {
		navigateMock.mockReset();
		resetPasswordMock.mockReset();
	});

	it("calls the reset mutation with the form values", async () => {
		const resetCode = "test_reset_code";
		const password = "P@ssword123";

		resetPasswordMock.mockResolvedValue({ login: false, reset: false });

		renderWithProviders(<ResetForm resetCode={resetCode} />);

		await userEvent.type(screen.getByLabelText("Password"), password);
		await userEvent.click(screen.getByRole("button", { name: "Reset" }));

		await waitFor(() => expect(resetPasswordMock).toHaveBeenCalledTimes(1));
		expect(resetPasswordMock).toHaveBeenCalledWith(
			{ password, resetCode },
			expect.anything(),
		);
	});

	it("displays the thrown error message on reset failure", async () => {
		const resetCode = "test_reset_code";
		const password = "P@ssword123";
		const errorMessage = "Cannot reuse current password";

		resetPasswordMock.mockRejectedValue(new Error(errorMessage));

		renderWithProviders(<ResetForm resetCode={resetCode} />);

		await userEvent.type(screen.getByLabelText("Password"), password);
		await userEvent.click(screen.getByRole("button", { name: "Reset" }));

		expect(await screen.findByText(errorMessage)).toBeInTheDocument();
	});

	it("rejects a password shorter than eight characters without submitting", async () => {
		renderWithProviders(<ResetForm resetCode="test_reset_code" />);

		await userEvent.type(screen.getByLabelText("Password"), "short12");
		await userEvent.click(screen.getByRole("button", { name: "Reset" }));

		expect(
			await screen.findByText(
				"Password does not meet minimum length requirement (8)",
			),
		).toBeInTheDocument();
		expect(resetPasswordMock).not.toHaveBeenCalled();
	});

	it("navigates to the redirect on a successful reset", async () => {
		resetPasswordMock.mockResolvedValue({ login: false, reset: false });

		renderWithProviders(
			<ResetForm redirect="/samples" resetCode="test_reset_code" />,
		);

		await userEvent.type(screen.getByLabelText("Password"), "P@ssword123");
		await userEvent.click(screen.getByRole("button", { name: "Reset" }));

		await waitFor(() =>
			expect(navigateMock).toHaveBeenCalledWith({ to: "/samples" }),
		);
	});

	it("navigates to the root when no redirect is provided", async () => {
		resetPasswordMock.mockResolvedValue({ login: false, reset: false });

		renderWithProviders(<ResetForm resetCode="test_reset_code" />);

		await userEvent.type(screen.getByLabelText("Password"), "P@ssword123");
		await userEvent.click(screen.getByRole("button", { name: "Reset" }));

		await waitFor(() => expect(navigateMock).toHaveBeenCalledWith({ to: "/" }));
	});
});
