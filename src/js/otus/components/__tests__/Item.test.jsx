import { createBrowserHistory } from "history";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithRouter } from "../../../../tests/setupTests";
import { mapStateToProps, OTUItem } from "../OTUItem";

describe("<OTUItem />", () => {
    let props;

    beforeEach(() => {
        props = {
            abbreviation: "FB",
            id: "foo",
            name: "Foo",
            verified: true,
            refId: "baz",
        };
    });

    it("should render when [verified=true]", () => {
        const history = createBrowserHistory();

        renderWithRouter(<OTUItem {...props} />, {}, history);

        const link = screen.getByRole("link");

        expect(link).toHaveTextContent("Foo");
        expect(link).toHaveAttribute("href", "/refs/baz/otus/foo");
        expect(screen.queryByText("Unverified")).not.toBeInTheDocument();
    });

    it("should render when [verified=false]", () => {
        const history = createBrowserHistory();

        renderWithRouter(<OTUItem {...props} verified={false} />, {}, history);

        const link = screen.getByRole("link");

        expect(link).toHaveTextContent("Foo");
        expect(link).toHaveAttribute("href", "/refs/baz/otus/foo");

        expect(screen.getByText("Unverified")).toBeInTheDocument();
    });
});

describe("mapStateToProps()", () => {
    it("should return props given state", () => {
        const state = {
            otus: {
                documents: [
                    {
                        id: "foo",
                        name: "Foo",
                        abbreviation: "FO",
                        verified: true,
                    },
                    {
                        id: "bar",
                        name: "Bar",
                        abbreviation: "BR",
                        verified: true,
                    },
                    {
                        id: "baz",
                        name: "Baz",
                        abbreviation: "BZ",
                        verified: true,
                    },
                ],
            },
            references: {
                detail: {
                    id: "ref",
                },
            },
        };
        const result = mapStateToProps(state, { index: 1 });
        expect(result).toEqual({
            id: "bar",
            name: "Bar",
            abbreviation: "BR",
            verified: true,
            refId: "ref",
        });
    });
});
