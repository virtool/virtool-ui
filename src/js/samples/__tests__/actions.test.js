import { describe, expect, it } from "vitest";
import {
    CREATE_SAMPLE,
    FIND_SAMPLES,
    GET_SAMPLE,
    HIDE_SAMPLE_MODAL,
    SHOW_REMOVE_SAMPLE,
    UPDATE_SAMPLE,
    WS_INSERT_SAMPLE,
    WS_REMOVE_SAMPLE,
    WS_UPDATE_SAMPLE,
} from "../../app/actionTypes";
import {
    createSample,
    editSample,
    findSamples,
    getSample,
    hideSampleModal,
    showRemoveSample,
    wsInsertSample,
    wsRemoveSample,
    wsUpdateSample,
} from "../actions";

describe("Sample Action Creators:", () => {
    const sampleId = "foo";

    it("wsInsertSample", () => {
        const data = {
            id: "abc123",
            name: "test",
        };
        const result = wsInsertSample(data);
        expect(result).toEqual({
            type: WS_INSERT_SAMPLE,
            payload: { ...data },
        });
    });

    it("wsUpdateSample", () => {
        const data = {
            id: "abc123",
            name: "test-edited",
        };
        const result = wsUpdateSample(data);
        expect(result).toEqual({
            type: WS_UPDATE_SAMPLE,
            payload: { ...data },
        });
    });

    it("wsRemoveSample", () => {
        const data = ["test"];
        const result = wsRemoveSample(data);
        expect(result).toEqual({
            type: WS_REMOVE_SAMPLE,
            payload: data,
        });
    });

    it("findSamples", () => {
        const term = "foo";
        const labels = [1, 6];
        const page = 1;
        const workflows = "workflows";

        const result = findSamples({ term, labels, page, workflows });

        expect(result).toEqual({
            type: FIND_SAMPLES.REQUESTED,
            payload: { labels, term, page, workflows },
        });
    });

    it("getSample", () => {
        const result = getSample(sampleId);
        expect(result).toEqual({
            type: GET_SAMPLE.REQUESTED,
            payload: { sampleId },
        });
    });

    it("createSample", () => {
        const name = "name";
        const isolate = "isolate";
        const host = "host";
        const locale = "locale";
        const libraryType = false;
        const subtractions = ["subtractions"];
        const files = {};
        const result = createSample(name, isolate, host, locale, libraryType, subtractions, files);
        expect(result).toEqual({
            type: CREATE_SAMPLE.REQUESTED,
            payload: { name, isolate, host, locale, libraryType, subtractions, files },
        });
    });

    it("editSample", () => {
        const update = { foo: "bar" };
        const result = editSample(sampleId, update);
        expect(result).toEqual({
            type: UPDATE_SAMPLE.REQUESTED,
            payload: { sampleId, update },
        });
    });

    it("showRemoveSample", () => {
        expect(showRemoveSample()).toEqual({
            type: SHOW_REMOVE_SAMPLE,
        });
    });

    it("hideSampleModal", () => {
        expect(hideSampleModal()).toEqual({
            type: HIDE_SAMPLE_MODAL,
        });
    });
});
