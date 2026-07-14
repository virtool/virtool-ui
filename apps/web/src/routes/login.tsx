import { accountQueryOptions } from "@account/queries";
import { passwordPolicyQueryOptions } from "@administration/queries";
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
	reason: z.literal("session-ended").optional().catch(undefined),
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
			await queryClient.ensureQueryData(accountQueryOptions());
		} catch {
			return;
		}

		throw redirect({ to: search.redirect ?? "/" });
	},
	// The forced-reset form this route can render sets a password before there is
	// a session, so it needs the policy up front. prefetchQuery rather than
	// ensureQueryData: a failed policy read must not take down the wall.
	loader: ({ context }) =>
		context.queryClient.prefetchQuery(passwordPolicyQueryOptions()),
	component: LoginWall,
});
