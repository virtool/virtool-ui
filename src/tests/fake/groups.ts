import { faker } from "@faker-js/faker";
import { GroupMinimal } from "../../js/groups/types";

type createFakeGroupMinimalProps = {
    name?: string;
};
export function createFakeGroupMinimal(props?: createFakeGroupMinimalProps): GroupMinimal {
    const { name } = props || {};
    return {
        id: faker.random.alphaNumeric(8),
        name: name || `${faker.random.word()}_group`,
    };
}
