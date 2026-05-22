import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import { afterEach, describe, expect, it, vi } from "vitest";

const { resetPasswordMock } = vi.hoisted(() => ({
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

import ResetForm from "../ResetForm";

describe("<ResetForm />", () => {
	afterEach(() => {
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
		expect(resetPasswordMock.mock.calls[0][0]).toEqual({ password, resetCode });
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
});
