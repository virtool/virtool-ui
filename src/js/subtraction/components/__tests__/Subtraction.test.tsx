import { screen, waitFor } from "@testing-library/react";
import { createBrowserHistory } from "history";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithRouter } from "../../../../tests/setupTests";
import Subtraction from "../Subtraction";

const subtractionList = {
    documents: [{ id: "foo", name: "bar", user: { handle: "test" } }],
};

describe("<Subtraction />", () => {
    let history;
    beforeEach(() => {
        history = createBrowserHistory();
        history.push("/subtractions");
    });

    it("should render", async () => {
        const scope = nock("http://localhost").get("/api/subtractions").query(true).reply(200, subtractionList);
        renderWithRouter(<Subtraction />, {}, history);

        await waitFor(() => expect(screen.queryByLabelText("loading")).not.toBeInTheDocument());
        const subtractionHeader = screen.getByText("Subtractions");
        expect(subtractionHeader).toBeInTheDocument();

        scope.isDone();
    });
});
