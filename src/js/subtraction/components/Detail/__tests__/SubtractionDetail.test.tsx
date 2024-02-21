import { screen } from "@testing-library/react";
import { createBrowserHistory } from "history";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeAccount, mockAPIGetAccount } from "../../../../../tests/fake/account";
import { createFakePermissions } from "../../../../../tests/fake/permissions";
import { createFakeSubtraction, mockApiGetSubtractionDetail } from "../../../../../tests/fake/subtractions";
import { renderWithProviders, renderWithRouter } from "../../../../../tests/setupTests";
import SubtractionDetail from "../SubtractionDetail";

describe("<SubtractionDetail />", () => {
    const subtractionDetail = createFakeSubtraction();
    const history = createBrowserHistory();
    let props;

    beforeEach(() => {
        props = {
            match: { params: { subtractionId: subtractionDetail.id } },
        };
    });

    afterEach(() => nock.cleanAll());

    it("should render", async () => {
        const scope = mockApiGetSubtractionDetail(subtractionDetail);
        renderWithRouter(<SubtractionDetail {...props} />, {}, history);

        expect(await screen.findByText(subtractionDetail.name)).toBeInTheDocument();
        expect(await screen.findByText(subtractionDetail.nickname)).toBeInTheDocument();
        expect(await screen.findByText(subtractionDetail.file.name)).toBeInTheDocument();
        expect(await screen.findByText(subtractionDetail.linked_samples.length)).toBeInTheDocument();
        expect(await screen.findByText(subtractionDetail.files[0].name)).toBeInTheDocument();

        scope.done();
    });

    it("should render loading when [detail=null]", () => {
        renderWithProviders(<SubtractionDetail {...props} />);

        expect(screen.getByLabelText("loading")).toBeInTheDocument();
        expect(screen.queryByText(subtractionDetail.name)).not.toBeInTheDocument();
    });

    it("should render pending message when subtraction is not ready", async () => {
        const subtractionDetail = createFakeSubtraction({ ready: false });
        props.match.params.subtractionId = subtractionDetail.id;
        const scope = mockApiGetSubtractionDetail(subtractionDetail);
        renderWithProviders(<SubtractionDetail {...props} />);

        expect(await screen.findByText("Subtraction is still being imported")).toBeInTheDocument();

        scope.done();
    });

    it("should not render icons when [canModify=true]", async () => {
        const permissions = createFakePermissions({ modify_subtraction: true });
        const account = createFakeAccount({ permissions });
        mockAPIGetAccount(account);
        const scope = mockApiGetSubtractionDetail(subtractionDetail);
        renderWithRouter(<SubtractionDetail {...props} />, {}, history);

        expect(await screen.findByText(subtractionDetail.name)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "edit" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "remove" })).toBeInTheDocument();

        scope.done();
    });

    it("should not render icons when [canModify=false]", async () => {
        const permissions = createFakePermissions({ modify_subtraction: false });
        const account = createFakeAccount({ permissions });
        mockAPIGetAccount(account);
        const scope = mockApiGetSubtractionDetail(subtractionDetail);
        renderWithRouter(<SubtractionDetail {...props} />, {}, history);

        expect(await screen.findByText(subtractionDetail.name)).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "edit" })).toBeNull();
        expect(screen.queryByRole("button", { name: "remove" })).toBeNull();

        scope.done();
    });

    it("should render file id when name not defined", async () => {
        const subtractionDetail = createFakeSubtraction({ file: { id: "test", name: null } });
        props.match.params.subtractionId = subtractionDetail.id;
        const scope = mockApiGetSubtractionDetail(subtractionDetail);
        renderWithRouter(<SubtractionDetail {...props} />, {}, history);

        expect(await screen.findByText("test")).toBeInTheDocument();

        scope.done();
    });
});
