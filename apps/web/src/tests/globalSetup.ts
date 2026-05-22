import { MongoDBContainer } from "@testcontainers/mongodb";
import { PostgreSqlContainer } from "@testcontainers/postgresql";

let postgres: Awaited<ReturnType<PostgreSqlContainer["start"]>> | undefined;
let mongo: Awaited<ReturnType<MongoDBContainer["start"]>> | undefined;

export async function setup() {
	[postgres, mongo] = await Promise.all([
		new PostgreSqlContainer("postgres:18")
			.withDatabase("virtool")
			.withUsername("virtool")
			.withPassword("virtool")
			.withReuse()
			.start(),
		new MongoDBContainer("mongo:8").withReuse().start(),
	]);

	process.env.VT_POSTGRES_URL = postgres.getConnectionUri();
	process.env.VT_MONGODB_URL = `${mongo.getConnectionString()}?directConnection=true`;
}

export async function teardown() {
	await Promise.allSettled([postgres?.stop(), mongo?.stop()]);
}
