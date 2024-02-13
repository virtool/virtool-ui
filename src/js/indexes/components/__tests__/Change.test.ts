import { describe, expect, it } from "vitest";
import { mapStateToProps } from "../Change";

describe("mapStateToProps", () => {
    it("should return props", () => {
        const state = {
            indexes: {
                history: {
                    documents: [
                        {
                            otu: {
                                name: "Baz",
                            },
                            description: "Boom",
                        },
                    ],
                },
            },
        };
        const ownProps = {
            index: 0,
        };
        const props = mapStateToProps(state, ownProps);

        expect(props).toEqual({
            description: "Boom",
            otuName: "Baz",
        });
    });
});
