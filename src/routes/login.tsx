import { fetchAccount } from "@account/api";
import { accountKeys } from "@account/queries";
import { createFileRoute, redirect } from "@tanstack/react-router";
import LoginWall from "@wall/components/LoginWall";
import { z } from "zod/v4";

const loginSearchSchema = z.object({
	redirect: z.string().optional().catch(undefined),
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
