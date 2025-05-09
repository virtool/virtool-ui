import Subtraction from "@subtraction/components/Subtraction";
import { SubtractionMinimal } from "@subtraction/types";
import { screen } from "@testing-library/react";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakePermissions } from "@tests/fake/permissions";
import {
    createFakeSubtraction,
    mockApiGetSubtractionDetail,
} from "@tests/fake/subtractions";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import React from "react";
import { describe, expect, it } from "vitest";

function formatSubtractionPath(subtraction: SubtractionMinimal) {
    return `/subtractions/${subtraction.id}`;
}

describe("<SubtractionDetail />", () => {
    let subtraction;
    let path;

    beforeEach(() => {
        subtraction = createFakeSubtraction();
        path = formatSubtractionPath(subtraction);
    });

    afterEach(() => nock.cleanAll());

    it("should render", async () => {
        const scope = mockApiGetSubtractionDetail(subtraction);

        renderWithRouter(<Subtraction />, path);

        expect(await screen.findByText(subtraction.name)).toBeInTheDocument();
        expect(
            await screen.findByText(subtraction.nickname),
        ).toBeInTheDocument();
        expect(
            await screen.findByText(subtraction.file.name),
        ).toBeInTheDocument();
        expect(
            await screen.findByText(subtraction.linked_samples.length),
        ).toBeInTheDocument();
        expect(
            await screen.findByText(subtraction.files[0].name),
        ).toBeInTheDocument();

        scope.done();
    });

    it("should render loading when [detail=null]", () => {
        renderWithRouter(<Subtraction />, path);

        expect(screen.getByLabelText("loading")).toBeInTheDocument();
        expect(screen.queryByText(subtraction.name)).not.toBeInTheDocument();
    });

    it("should render pending message when subtraction is not ready", async () => {
        const unreadySubtraction = createFakeSubtraction({ ready: false });
        const scope = mockApiGetSubtractionDetail(unreadySubtraction);

        renderWithRouter(
            <Subtraction />,
            formatSubtractionPath(unreadySubtraction),
        );

        expect(
            await screen.findByText("Subtraction is still being imported"),
        ).toBeInTheDocument();

        scope.done();
    });

    it("should not render icons when [canModify=true]", async () => {
        const permissions = createFakePermissions({ modify_subtraction: true });
        const account = createFakeAccount({ permissions });

        mockApiGetAccount(account);
        const scope = mockApiGetSubtractionDetail(subtraction);

        renderWithRouter(<Subtraction />, path);

        expect(await screen.findByText(subtraction.name)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "modify" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "remove" }),
        ).toBeInTheDocument();

        scope.done();
    });

    it("should not render icons when [canModify=false]", async () => {
        const permissions = createFakePermissions({
            modify_subtraction: false,
        });
        const account = createFakeAccount({ permissions });

        mockApiGetAccount(account);
        const scope = mockApiGetSubtractionDetail(subtraction);

        renderWithRouter(<Subtraction />, path);

        expect(await screen.findByText(subtraction.name)).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "modify" })).toBeNull();
        expect(screen.queryByRole("button", { name: "remove" })).toBeNull();

        scope.done();
    });

    it("should render file id when name not defined", async () => {
        const subtraction = createFakeSubtraction({
            file: { id: "test", name: null },
        });
        const scope = mockApiGetSubtractionDetail(subtraction);
        renderWithRouter(<Subtraction />, formatSubtractionPath(subtraction));

        expect(await screen.findByText("test")).toBeInTheDocument();

        scope.done();
    });
});
