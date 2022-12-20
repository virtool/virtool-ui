import { faker } from "@faker-js/faker";
import { times, toString } from "lodash-es";

type Entry = {
    accession: string;
    gi: string;
    name: string;
    organism: string;
};

type families = {
    family1: number;
    family2: number;
};

class HMMDetail {
    cluster: number;
    count: number;
    entries: Entry[];
    families: families;
    genera: {
        genera1: number;
        genera2: number;
    };
    id: string;
    length: number;
    mean_entropy: number;
    names: string[];
    total_entropy: number;
}

function createFakeHMMDetail(): HMMDetail {
    const entries = times(5, () => ({
        accession: faker.word.noun(),
        gi: faker.word.noun(),
        name: faker.word.noun(),
        organism: faker.word.noun()
    }));

    const names = times(5, (i: number) => ({
        name: `name${i}`
    }));

    return {
        cluster: faker.datatype.number(),
        count: faker.datatype.number(),
        entries,
        families: {
            family1: faker.datatype.number(),
            family2: faker.datatype.number()
        },
        genera: {
            genera1: faker.datatype.number(),
            genera2: faker.datatype.number()
        },
        id: faker.random.alphaNumeric(9, { casing: "lower" }),
        length: faker.datatype.number(),
        mean_entropy: faker.datatype.number(),
        names,
        total_entropy: faker.datatype.number()
    };
}

type HMMDocument = {
    cluster: number;
    count: number;
    families: families;
    id: string;
    names: string[];
};

type HMMStatus = {
    errors: string[];
    installed: {
        ready: boolean;
    };
    user: {
        id: string;
        administrator: boolean;
        handle: string;
    };
};

class HMMData {
    detail: HMMDetail;
    documents: HMMDocument[];
    found_count: number;
    page: number;
    page_count: number;
    per_page: number;
    status: HMMStatus;
    task: string;
    term: string;
    total_count: number;
}

export function createFakeHMMData(): HMMData {
    const documents = times(5, () => ({
        cluster: faker.datatype.number(),
        count: faker.datatype.number(),
        families: {
            None: faker.datatype.number(),
            Papillomaviridae: faker.datatype.number()
        },
        id: faker.random.alphaNumeric(9, { casing: "lower" }),
        names: [faker.name.lastName()]
    }));

    const status = {
        errors: [toString(faker.internet.httpStatusCode())],
        installed: {
            ready: faker.datatype.boolean()
        },
        user: {
            id: faker.random.alphaNumeric(9, { casing: "lower" }),
            administrator: faker.datatype.boolean(),
            handle: faker.internet.userName()
        }
    };

    return {
        detail: createFakeHMMDetail(),
        documents,
        found_count: faker.datatype.number(),
        page: faker.datatype.number(),
        page_count: faker.datatype.number(),
        per_page: faker.datatype.number(),
        status,
        task: faker.random.alphaNumeric(9, { casing: "lower" }),
        term: "",
        total_count: faker.datatype.number()
    };
}
