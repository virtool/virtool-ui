import { fetchAccount } from "@account/api";
import { accountKeys } from "@account/queries";
import { createFileRoute, redirect } from "@tanstack/react-router";
import LoginWall from "@wall/components/LoginWall";
import { z } from "zod/v4";

function isSafeRedirect(value: string): boolean {
	return (
		value.startsWith("/") &&
		!value.startsWith("//") &&
		!value.startsWith("/login")
	);
}

const loginSearchSchema = z.object({
	redirect: z
		.string()
		.optional()
		.refine((val) => !val || isSafeRedirect(val))
		.catch(undefined),
});

export const Route = createFileRoute("/login")({
	validateSearch: loginSearchSchema,
	beforeLoad: async ({ context, search }) => {
		const { queryClient } = context;

		try {
			await queryClient.ensureQueryData({
				queryKey: accountKeys.all(),
				queryFn: fetchAccount,
			});
		} catch {
			return;
		}

		throw redirect({ to: search.redirect ?? "/" });
	},
	component: LoginWall,
});
