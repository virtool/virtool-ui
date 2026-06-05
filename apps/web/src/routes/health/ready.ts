import { client } from "@server/db/pg";
import { checkPostgres, summarizeReadiness } from "@server/health/data";
import { createFileRoute } from "@tanstack/react-router";

async function handleReady(): Promise<Response> {
	const postgres = await checkPostgres(client);

	const report = summarizeReadiness(postgres);

	return Response.json(
		{ status: report.status, checks: report.checks },
		{ status: report.statusCode },
	);
}

export const Route = createFileRoute("/health/ready")({
	server: {
		handlers: {
			GET: handleReady,
		},
	},
});
