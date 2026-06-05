import { PostgreSqlContainer } from "@testcontainers/postgresql";

let postgres: Awaited<ReturnType<PostgreSqlContainer["start"]>> | undefined;

export async function setup() {
	postgres = await new PostgreSqlContainer("postgres:18")
		.withDatabase("virtool")
		.withUsername("virtool")
		.withPassword("virtool")
		.withReuse()
		.start();

	process.env.VT_POSTGRES_URL = postgres.getConnectionUri();
}

export async function teardown() {
	await postgres?.stop();
}
