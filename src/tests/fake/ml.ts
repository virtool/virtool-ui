import { faker } from "@faker-js/faker";
import { merge } from "lodash";
import nock from "nock";
import { MLModel, MLModelMinimal, MLModelRelease } from "../../js/ml/types";

/**
 * Create a fake ML model release object
 *
 * @param overrides - optional properties for creating a fake ML models with specific values
 */
export function createFakeMLModelRelease(): MLModelRelease {
    const id = faker.datatype.number(100);

    return {
        id,
        created_at: faker.date.past().toISOString(),
        download_url: `api/ml/${id}/download`,
        github_url: `http://github.com/virtool/ml/releases/${id})}`,
        name: `${faker.datatype.number(5)}.${faker.datatype.number(15)}.${faker.datatype.number(15)}`,
        published_at: faker.date.past().toISOString(),
        ready: true,
        size: faker.datatype.number(100000),
    };
}

type CreateFakeMLModelOverrides = {
    created_at?: string;
};

/**
 * Create a fake minimal ML model
 *
 * @param overrides - optional properties for creating a fake ML models with specific values
 */
export function createFakeMLModelMinimal(overrides?: CreateFakeMLModelOverrides): MLModelMinimal {
    return {
        id: faker.datatype.number(100),
        created_at: overrides.created_at ?? faker.date.past().toISOString(),
        description: faker.lorem.sentence(),
        latest_release: createFakeMLModelRelease(),
        name: `model-${faker.lorem.word()}`,
        release_count: faker.datatype.number(10),
    };
}

/**
 * Create a fake complete ML model
 *
 * @param overrides - optional properties for creating a fake ML models with specific values
 */
export function createFakeMLModel(overrides?: CreateFakeMLModelOverrides): MLModel {
    const releases = [createFakeMLModelRelease()];

    const defaultModel = {
        ...createFakeMLModelMinimal(overrides),
        latest_release: releases[0],
        releases,
    };

    return merge(defaultModel, overrides);
}

/**
 * Sets up a mocked API route for fetching a list of ML models
 *
 * @param MLModels - The list of ML models to be returned from the mocked API call
 * @param last_synced_at - The date the models were last synced with virtool.ca
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetModels(MLModels: MLModelMinimal[]) {
    return nock("http://localhost")
        .get("/api/ml")
        .reply(200, { items: MLModels, last_synced_at: faker.date.recent().toISOString() });
}
