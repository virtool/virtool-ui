import { faker } from "@faker-js/faker";
import { File, FileType } from "../../files/types";
import { UserNested } from "../../users/types";
import { merge } from "lodash-es";
import nock from "nock";
import { createFakeUserNested } from "./user";

type CreateFakeFileProps = {
    id?: string;
    created_at?: Date;
    name?: string;
    name_on_disk?: string;
    ready?: boolean;
    removed?: boolean;
    removed_at?: Date;
    reserved?: boolean;
    size?: number;
    type?: FileType;
    uploaded_at?: Date;
    user?: UserNested;
};

/**
 * Create a File object with fake data
 *
 * @param {CreateFakeFileProps} props values to override the default automatically generated values
 * @returns {File} a File object with fake data
 */
export function createFakeFile(props?: CreateFakeFileProps): File {
    let { name, name_on_disk } = props || {};
    name =
        name === undefined ? `sample${faker.datatype.number()}.fastq.gz` : name;
    name_on_disk =
        name_on_disk === undefined
            ? `${faker.datatype.number()}-${name}`
            : name_on_disk;

    const defaultFile = {
        id: faker.datatype.number(),
        created_at: faker.date.past(),
        name,
        name_on_disk: name_on_disk,
        ready: true,
        removed: false,
        removed_at: undefined,
        reserved: false,
        size: faker.datatype.number(),
        type: FileType.reads,
        uploaded_at: faker.date.past(),
        user: createFakeUserNested(),
    };

    return merge(defaultFile, props);
}

/**
 * Create a File object with fake data
 *
 * @param {File[]} files values to override the default automatically generated values
 * @param {boolean} query whether to include query parameters in the request
 * @returns {File} a File object with fake data
 */
export function mockApiListFiles(files: Array<File>, query?: boolean) {
    return nock("http://localhost")
        .get("/api/uploads")
        .query(query || true)
        .reply(200, {
            found_count: files.length,
            page: 1,
            page_count: 1,
            per_page: 25,
            total_count: files.length,
            items: files,
        });
}

/**
 * Creates a mocked API call for getting an unpaginated list of files.
 *
 * @param {File[]} files files to be returned from the mocked API call
 * @returns {nock.Scope} nock scope for the mocked API call
 */
export function mockApiUnpaginatedListFiles(files: File[], query?: boolean) {
    return nock("http://localhost")
        .get("/api/uploads")
        .query(query || true)
        .reply(200, {
            documents: files,
        });
}

/**
 * Creates a mocked API call for deleting a file.
 *
 * @param {string} fileId id of the file that is expected to be deleted
 * @returns {nock.Scope} nock scope for the mocked API call
 */
export function mockApiDeleteFile(fileId: string) {
    return nock("http://localhost").delete(`/api/uploads/${fileId}`).reply(200);
}
