import { mapDispatchToProps } from "../Labels";
import { vi } from "vitest";

describe("mapDispatchToProps()", () => {
    let dispatch;
    let props;

    beforeEach(() => {
        dispatch = vi.fn();
        props = mapDispatchToProps(dispatch);
    });

    it("should return onLoadLabels() in props", () => {
        props.onLoadLabels();
        expect(dispatch).toHaveBeenCalledWith({ type: "LIST_LABELS_REQUESTED" });
    });

    it("should return onHide() in props", () => {
        props.onHide();
        expect(dispatch).toHaveBeenCalledWith({ type: "PUSH_STATE", payload: { state: { removeLabel: false } } });
    });
});
