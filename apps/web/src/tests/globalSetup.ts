import { PostgreSqlContainer } from "@testcontainers/postgresql";

export async function setup() {
	const postgres = await new PostgreSqlContainer("postgres:18")
		.withDatabase("virtool")
		.withUsername("virtool")
		.withPassword("virtool")
		.withReuse()
		.start();

	process.env.VT_POSTGRES_URL = postgres.getConnectionUri();
}

// Left empty on purpose. stop() removes the container, so withReuse() finds
// nothing to match on the next run and starts a fresh one. Clean up with
// `docker rm -f` when the container is no longer wanted.
export async function teardown() {}
