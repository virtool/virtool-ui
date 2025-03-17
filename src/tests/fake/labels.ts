import { faker } from "@faker-js/faker";
import nock from "nock";
import { LabelNested } from "../../js/labels/types";

export function createFakeLabelNested(): LabelNested {
    return {
        color: faker.color.rgb({ casing: "upper" }),
        description: faker.lorem.lines(1),
        id: faker.number.int(),
        name: faker.random.word(),
    };
}

export function mockApiGetLabels(labels: LabelNested[]) {
    return nock("http://localhost")
        .get("/api/labels")
        .query(true)
        .reply(200, labels);
}
