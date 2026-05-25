import type { Banner } from "@banner/types";
import { faker } from "@faker-js/faker";
import { createFakeUserNested } from "./user";

/**
 * Create a fake banner.
 *
 * @param overrides - optional properties for creating a fake banner with specific values
 */
export function createFakeBanner(overrides?: Partial<Banner>): Banner {
	return {
		active: true,
		color: "red",
		created_at: faker.date.past().toISOString(),
		id: faker.number.int(),
		message: faker.lorem.sentence(),
		updated_at: faker.date.past().toISOString(),
		user: createFakeUserNested(),
		...overrides,
	};
}
