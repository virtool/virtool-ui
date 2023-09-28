import { faker } from "@faker-js/faker";
import { merge } from "lodash";
import nock from "nock";
import { MLModel, MLModelMinimal, MLModelRelease } from "../../js/ml/types";

type CreateFakeMLModelReleaseOverrides = {
    id?: number;
    created_at?: string;
    download_url?: string;
    github_url?: string;
    name?: string;
    published_at?: string;
    ready?: boolean;
    size?: number;
};

/**
 * Create a fake ML model release object
 *
 * @param overrides - optional properties for creating a fake ML models with specific values
 */
export function createFakeMLModelRelease(overrides?: CreateFakeMLModelReleaseOverrides): MLModelRelease {
    const id = overrides?.id ?? faker.datatype.number(100);
    const defaultRelease = {
        id,
        created_at: faker.date.past().toISOString(),
        download_url: `api/ml/${id}/download`,
        github_url: `http://github.com/virtool/ml/releases/${id})}`,
        name: `${faker.datatype.number(5)}.${faker.datatype.number(15)}.${faker.datatype.number(15)}`,
        published_at: faker.date.past().toISOString(),
        ready: true,
        size: faker.datatype.number(100000),
    };

    return merge(defaultRelease, overrides);
}

type CreateFakeMLModelMinimalOverrides = {
    id?: number;
    created_at?: string;
    description?: string;
    latest_release?: MLModelRelease | null;
    name?: string;
    release_count?: number;
};

/**
 * Create a fake minimal ML model
 *
 * @param overrides - optional properties for creating a fake ML models with specific values
 */
export function createFakeMLModelMinimal(overrides?: CreateFakeMLModelMinimalOverrides): MLModelMinimal {
    const defaultMinimal = {
        id: faker.datatype.number(100),
        created_at: faker.date.past().toISOString(),
        description: faker.lorem.sentence(),
        latest_release: createFakeMLModelRelease(overrides?.latest_release),
        name: `model-${faker.lorem.word()}`,
        release_count: faker.datatype.number(10),
    };

    return merge(defaultMinimal, overrides);
}

type CreateFakeMLModelOverrides = CreateFakeMLModelMinimalOverrides & {
    releases?: MLModelRelease[];
};

/**
 * Create a fake complete ML model
 *
 * @param overrides - optional properties for creating a fake ML models with specific values
 */
export function createFakeMLModel(overrides?: CreateFakeMLModelOverrides): MLModel {
    const releases = overrides?.releases ?? [createFakeMLModelRelease()];

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
export function mockApiGetModels(MLModels: MLModelMinimal[], last_synced_at?: string) {
    return nock("http://localhost").get("/api/ml").reply(200, { items: MLModels, last_synced_at });
}
