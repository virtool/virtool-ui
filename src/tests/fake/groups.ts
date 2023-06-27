import { faker } from "@faker-js/faker";
import { merge } from "lodash-es";
import { GroupMinimal } from "../../js/groups/types";

type createFakeGroupMinimalProps = {
    id?: string;
    name?: string;
};
export function createFakeGroupMinimal(props?: createFakeGroupMinimalProps): GroupMinimal {
    const defaultGroupMinimal = {
        id: faker.random.alphaNumeric(8),
        name: `${faker.random.word()}_group`,
    };

    return merge(defaultGroupMinimal, props);
}
