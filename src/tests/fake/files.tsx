import { faker } from "@faker-js/faker";
import { merge } from "lodash-es";
import nock from "nock";
import { File, FileType } from "../../js/files/types";
import { UserNested } from "../../js/users/types";
import { createFakeUserNested } from "./user";

type createFakeFileProps = {
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
export const createFakeFile = (props?: createFakeFileProps): File => {
    let { name, name_on_disk } = props || {};
    name = name === undefined ? `sample${faker.datatype.number()}.fastq.gz` : name;
    name_on_disk = name_on_disk === undefined ? `${faker.datatype.number()}-${name}` : name_on_disk;

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
};

export const mockListFilesAPI = (files: Array<File>, query?: boolean) => {
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
};

export const mockUnpaginatedListFilesAPI = (files: Array<File>, query?: boolean) => {
    return nock("http://localhost")
        .get("/api/uploads")
        .query(query || true)
        .reply(200, {
            documents: files,
        });
};

type mockDeleteFileProps = {
    fileId: string;
};
export const mockDeleteFileAPI = ({ fileId }: mockDeleteFileProps) => {
    return nock("http://localhost").delete(`/api/uploads/${fileId}`).reply(200);
};
