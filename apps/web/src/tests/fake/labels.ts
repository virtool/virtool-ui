import { faker } from "@faker-js/faker";
import type { Label, LabelNested } from "@labels/types";

export function createFakeLabelNested(): LabelNested {
	return {
		color: faker.color.rgb({ casing: "upper" }),
		description: faker.lorem.lines(1),
		id: faker.number.int(),
		name: faker.word.noun({ strategy: "any-length" }),
	};
}

export function createFakeLabel(): Label {
	return {
		...createFakeLabelNested(),
		count: faker.number.int({ min: 0, max: 50 }),
	};
}
