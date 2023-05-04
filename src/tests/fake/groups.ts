import { faker } from "@faker-js/faker";
import { GroupMinimal } from "../../js/groups/types";

export function createFakeGroupMinimal(name: string = null): GroupMinimal {
    return {
        id: faker.random.alphaNumeric(8),
        name: name || `${faker.random.word()}_group`,
    };
}
