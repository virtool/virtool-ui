import { describe, expect, it } from "vitest";
import {
    CREATE_SUBTRACTION,
    EDIT_SUBTRACTION,
    FIND_SUBTRACTIONS,
    GET_SUBTRACTION,
    REMOVE_SUBTRACTION,
    WS_INSERT_SUBTRACTION,
    WS_REMOVE_SUBTRACTION,
    WS_UPDATE_SUBTRACTION,
} from "../../app/actionTypes";
import {
    createSubtraction,
    editSubtraction,
    findSubtractions,
    getSubtraction,
    removeSubtraction,
    wsInsertSubtraction,
    wsRemoveSubtraction,
    wsUpdateSubtraction,
} from "../actions";

describe("Subtraction Action Creators:", () => {
    const subtractionId = "foobar";

    it("wsInsertSubtraction", () => {
        const data = {
            file: {
                id: "abc123-test.171",
                name: "test.171",
            },
            id: "testSubtraction",
            job: { id: "jobId" },
            ready: false,
        };
        const result = wsInsertSubtraction(data);
        expect(result).toEqual({
            type: WS_INSERT_SUBTRACTION,
            payload: { ...data },
        });
    });

    it("wsUpdateSubtraction", () => {
        const data = {
            file: {
                id: "abc123-test.171",
                name: "test.171",
            },
            id: "testSubtraction",
            job: { id: "jobId" },
            ready: true,
        };
        const result = wsUpdateSubtraction(data);
        expect(result).toEqual({
            type: WS_UPDATE_SUBTRACTION,
            payload: { ...data },
        });
    });

    it("wsRemoveSubtraction", () => {
        const data = ["testSubtraction"];
        const result = wsRemoveSubtraction(data);
        expect(result).toEqual({
            type: WS_REMOVE_SUBTRACTION,
            payload: data,
        });
    });

    it("findSubtractions", () => {
        const term = "foo";
        const page = 123;
        const result = findSubtractions(term, page);
        expect(result).toEqual({
            type: FIND_SUBTRACTIONS.REQUESTED,
            payload: { term, page },
        });
    });

    it("getSubtraction", () => {
        const result = getSubtraction(subtractionId);
        expect(result).toEqual({
            type: GET_SUBTRACTION.REQUESTED,
            payload: { subtractionId },
        });
    });

    it("createSubtraction", () => {
        const uploadId = "foo.fa";
        const name = "Foo";
        const nickname = "nickname";
        const result = createSubtraction(uploadId, name, nickname);

        expect(result).toEqual({
            type: CREATE_SUBTRACTION.REQUESTED,
            payload: { uploadId, name, nickname },
        });
    });

    it("editSubtraction", () => {
        const name = "foo";
        const nickname = "bar";
        const result = editSubtraction(subtractionId, name, nickname);
        expect(result).toEqual({
            type: EDIT_SUBTRACTION.REQUESTED,
            payload: { subtractionId, name, nickname },
        });
    });

    it("removeSubtraction", () => {
        const result = removeSubtraction(subtractionId);
        expect(result).toEqual({
            type: REMOVE_SUBTRACTION.REQUESTED,
            payload: { subtractionId },
        });
    });
});
