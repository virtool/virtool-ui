import { faker } from "@faker-js/faker";
import { merge } from "lodash";
import { ReferenceDataType } from "../../js/references/types";

type CreateFakeReferenceNestedProps = {
    id?: string;
    data_type?: ReferenceDataType;
    name?: string;
};

export function createFakeReferenceNested(props?: CreateFakeReferenceNestedProps) {
    const defaultReferenceNested = {
        id: faker.random.alphaNumeric(8),
        data_type: faker.helpers.arrayElement(["barcode", "genome"]),
        name: faker.random.word(),
    };

    return merge(defaultReferenceNested, props);
}
