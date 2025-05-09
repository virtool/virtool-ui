import { faker } from "@faker-js/faker";
import { MlModel, MLModelMinimal, MLModelRelease } from "@ml/types";
import { merge } from "lodash";
import nock from "nock";

/**
 * Create a fake ML model release object
 **/
export function createFakeMlModelRelease(): MLModelRelease {
    const id = faker.number.int(100);

    return {
        id,
        created_at: faker.date.past().toISOString(),
        download_url: `api/ml/${id}/download`,
        github_url: `https://github.com/virtool/ml/releases/${id})}`,
        name: `${faker.number.int(5)}.${faker.number.int(15)}.${faker.number.int(15)}`,
        published_at: faker.date.past().toISOString(),
        ready: true,
        size: faker.number.int(100000),
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
export function createFakeMLModelMinimal(
    overrides?: CreateFakeMLModelOverrides,
): MLModelMinimal {
    return {
        id: faker.number.int(100),
        created_at: overrides?.created_at ?? faker.date.past().toISOString(),
        description: faker.lorem.sentence(),
        latest_release: createFakeMlModelRelease(),
        name: `model-${faker.lorem.word()}`,
        release_count: faker.number.int(10),
    };
}

/**
 * Create a fake complete ML model
 *
 * @param overrides - optional properties for creating a fake ML models with specific values
 */
export function createFakeMLModel(
    overrides?: CreateFakeMLModelOverrides,
): MlModel {
    const releases = [createFakeMlModelRelease()];

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
 * @param mlModels - The list of ML models to be returned from the mocked API call
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetModels(mlModels: MLModelMinimal[]) {
    return nock("http://localhost").get("/api/ml").reply(200, {
        items: mlModels,
        last_synced_at: faker.date.recent().toISOString(),
    });
}
