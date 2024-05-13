import { describe, expect, it } from "vitest";
import { EDIT_REFERENCE, WS_UPDATE_REFERENCE } from "../../app/actionTypes";
import { editReference, wsUpdateReference } from "../actions";

describe("References Action Creators:", () => {
    it("wsUpdateReference", () => {
        const payload = { id: "test" };
        const result = wsUpdateReference(payload);
        expect(result).toEqual({
            type: WS_UPDATE_REFERENCE,
            payload,
        });
    });

    it("editReference", () => {
        const refId = "123abc";
        const update = { foo: "bar" };
        const result = editReference(refId, update);
        expect(result).toEqual({
            type: EDIT_REFERENCE.REQUESTED,
            payload: { refId, update },
        });
    });
});
