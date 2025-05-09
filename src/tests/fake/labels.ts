import { faker } from "@faker-js/faker";
import { LabelNested } from "@labels/types";
import nock from "nock";

export function createFakeLabelNested(): LabelNested {
    return {
        color: faker.color.rgb({ casing: "upper" }),
        description: faker.lorem.lines(1),
        id: faker.number.int(),
        name: faker.word.noun(),
    };
}

export function mockApiGetLabels(labels: LabelNested[]) {
    return nock("http://localhost")
        .get("/api/labels")
        .query(true)
        .reply(200, labels);
}
