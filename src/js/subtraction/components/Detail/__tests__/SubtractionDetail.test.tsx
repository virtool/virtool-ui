import { screen } from "@testing-library/react";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import { createFakePermissions } from "@tests/fake/permissions";
import { createFakeSubtraction, mockApiGetSubtractionDetail } from "@tests/fake/subtractions";
import { renderWithMemoryRouter } from "@tests/setupTests";
import nock from "nock";
import React from "react";
import { describe, expect, it } from "vitest";
import Subtraction from "../../Subtraction";

describe("<SubtractionDetail />", () => {
    const subtractionDetail = createFakeSubtraction();

    afterEach(() => nock.cleanAll());

    it("should render", async () => {
        const scope = mockApiGetSubtractionDetail(subtractionDetail);
        renderWithMemoryRouter(<Subtraction />, `/${subtractionDetail.id}`);

        expect(await screen.findByText(subtractionDetail.name)).toBeInTheDocument();
        expect(await screen.findByText(subtractionDetail.nickname)).toBeInTheDocument();
        expect(await screen.findByText(subtractionDetail.file.name)).toBeInTheDocument();
        expect(await screen.findByText(subtractionDetail.linked_samples.length)).toBeInTheDocument();
        expect(await screen.findByText(subtractionDetail.files[0].name)).toBeInTheDocument();

        scope.done();
    });

    it("should render loading when [detail=null]", () => {
        renderWithMemoryRouter(<Subtraction />, `/${subtractionDetail.id}`);

        expect(screen.getByLabelText("loading")).toBeInTheDocument();
        expect(screen.queryByText(subtractionDetail.name)).not.toBeInTheDocument();
    });

    it("should render pending message when subtraction is not ready", async () => {
        const subtractionDetail = createFakeSubtraction({ ready: false });
        const scope = mockApiGetSubtractionDetail(subtractionDetail);
        renderWithMemoryRouter(<Subtraction />, `/${subtractionDetail.id}`);

        expect(await screen.findByText("Subtraction is still being imported")).toBeInTheDocument();

        scope.done();
    });

    it("should not render icons when [canModify=true]", async () => {
        const permissions = createFakePermissions({ modify_subtraction: true });
        const account = createFakeAccount({ permissions });
        mockApiGetAccount(account);
        const scope = mockApiGetSubtractionDetail(subtractionDetail);
        renderWithMemoryRouter(<Subtraction />, `/${subtractionDetail.id}`);

        expect(await screen.findByText(subtractionDetail.name)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "modify" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "remove" })).toBeInTheDocument();

        scope.done();
    });

    it("should not render icons when [canModify=false]", async () => {
        const permissions = createFakePermissions({ modify_subtraction: false });
        const account = createFakeAccount({ permissions });
        mockApiGetAccount(account);
        const scope = mockApiGetSubtractionDetail(subtractionDetail);
        renderWithMemoryRouter(<Subtraction />, `/${subtractionDetail.id}`);

        expect(await screen.findByText(subtractionDetail.name)).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "modify" })).toBeNull();
        expect(screen.queryByRole("button", { name: "remove" })).toBeNull();

        scope.done();
    });

    it("should render file id when name not defined", async () => {
        const subtractionDetail = createFakeSubtraction({ file: { id: "test", name: null } });
        const scope = mockApiGetSubtractionDetail(subtractionDetail);
        renderWithMemoryRouter(<Subtraction />, `/${subtractionDetail.id}`);

        expect(await screen.findByText("test")).toBeInTheDocument();

        scope.done();
    });
});
