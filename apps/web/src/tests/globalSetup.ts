import { PostgreSqlContainer } from "@testcontainers/postgresql";

export async function setup() {
	const postgres = await new PostgreSqlContainer("postgres:18")
		.withDatabase("virtool")
		.withUsername("virtool")
		.withPassword("virtool")
		.withReuse()
		.start();

	process.env.VT_POSTGRES_URL = postgres.getConnectionUri();

	// `src/server/config.ts` parses the environment when it is imported, so these
	// have to be satisfiable for any test that reaches a server module. Unit
	// tests exercise storage through MemoryStorage and never reach a real bucket;
	// the storage project overrides these with live container endpoints.
	process.env.VT_STORAGE_BACKEND = "s3";
	process.env.VT_STORAGE_S3_BUCKET = "virtool-test";
}

// Left empty on purpose. stop() removes the container, so withReuse() finds
// nothing to match on the next run and starts a fresh one. Clean up with
// `docker rm -f` when the container is no longer wanted.
export async function teardown() {}
