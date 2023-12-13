import { faker } from "@faker-js/faker";
import { LabelNested } from "../../js/labels/types";

export function createFakeLabelNested(): LabelNested {
    return {
        color: faker.color.rgb({ casing: "upper" }),
        description: faker.lorem.lines(1),
        id: faker.datatype.number(),
        name: faker.random.word(),
    };
}
