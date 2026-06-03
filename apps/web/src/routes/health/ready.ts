import { mongoose } from "@server/db/mongo";
import { client } from "@server/db/pg";
import {
	checkMongo,
	checkPostgres,
	summarizeReadiness,
} from "@server/health/data";
import { createFileRoute } from "@tanstack/react-router";

async function handleReady(): Promise<Response> {
	const [mongo, postgres] = await Promise.all([
		checkMongo(mongoose.connection),
		checkPostgres(client),
	]);

	const report = summarizeReadiness(mongo, postgres);

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
