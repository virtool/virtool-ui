import { AdministratorRoleName } from "@administration/types";
import { formatPath } from "@app/hooks";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeAccount, mockApiGetAccount } from "@tests/fake/account";
import {
    createFakeAnalysisMinimal,
    mockApiGetAnalyses,
} from "@tests/fake/analyses";
import { createFakeHmmSearchResults, mockApiGetHmms } from "@tests/fake/hmm";
import { createFakeSample, mockApiGetSampleDetail } from "@tests/fake/samples";
import { renderWithRouter } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Analyses from "../Analyses";

describe("<AnalysesList />", () => {
    let analyses;
    let sample;
    let basePath;

    beforeEach(() => {
        sample = createFakeSample();

        analyses = [
            createFakeAnalysisMinimal({ sample: { id: sample.id } }),
            createFakeAnalysisMinimal({
                sample: { id: sample.id },
                workflow: "nuvs",
            }),
        ];
        mockApiGetAnalyses(analyses);
        mockApiGetHmms(createFakeHmmSearchResults());
        basePath = `/samples/${sample.id}/analyses/`;
    });

    afterEach(() => nock.cleanAll());

    describe("<AnalysesList />", () => {
        it("should render", async () => {
            mockApiGetSampleDetail(sample);
            renderWithRouter(<Analyses />, basePath);

            expect(await screen.findByText("Pathoscope")).toBeInTheDocument();
            expect(
                screen.getByText(`${analyses[0].user.handle} created`),
            ).toBeInTheDocument();
            expect(screen.getByText("Nuvs")).toBeInTheDocument();
            expect(
                screen.getByText(`${analyses[1].user.handle} created`),
            ).toBeInTheDocument();
        });
    });

    describe("<AnalysesToolbar />", () => {
        it("should show analysis creation when user is full admin", async () => {
            const account = createFakeAccount({
                administrator_role: AdministratorRoleName.FULL,
            });
            mockApiGetAccount(account);
            mockApiGetSampleDetail(sample);
            renderWithRouter(<Analyses />, basePath);

            expect(await screen.findByText("Create")).toBeInTheDocument();
        });

        it("should show analysis creation when user is the owner of the sample", async () => {
            const account = createFakeAccount({ administrator_role: null });
            sample.user.id = account.id;
            mockApiGetAccount(account);
            mockApiGetSampleDetail(sample);
            renderWithRouter(<Analyses />, basePath);

            expect(await screen.findByText("Create")).toBeInTheDocument();
        });

        it("should show analysis creation when user is in the correct group and write is enabled", async () => {
            const account = createFakeAccount({ administrator_role: null });
            sample.group = account.groups[0].id;
            sample.group_write = true;
            mockApiGetAccount(account);
            mockApiGetSampleDetail(sample);
            renderWithRouter(<Analyses />, basePath);

            expect(await screen.findByText("Create")).toBeInTheDocument();
        });

        it("should show analysis creation when all users editing a sample is permitted", async () => {
            const account = createFakeAccount({ administrator_role: null });
            mockApiGetAccount(account);

            sample.all_write = true;
            mockApiGetSampleDetail(sample);

            renderWithRouter(<Analyses />, basePath);

            expect(await screen.findByText("Create")).toBeInTheDocument();
        });

        it("should not render analysis creation option when user has no permissions", async () => {
            const account = createFakeAccount({ administrator_role: null });
            mockApiGetAccount(account);
            mockApiGetSampleDetail(sample);
            renderWithRouter(<Analyses />, `/samples/${sample.id}/analyses/`);

            expect(await screen.queryByText("Create")).not.toBeInTheDocument();
        });

        it("should change state once create analysis is clicked", async () => {
            mockApiGetAccount(
                createFakeAccount({
                    administrator_role: AdministratorRoleName.FULL,
                }),
            );
            mockApiGetSampleDetail(sample);

            const { history } = renderWithRouter(
                <Analyses />,
                `/samples/${sample.id}/analyses`,
            );

            expect(await screen.findByText("Create")).toBeInTheDocument();
            expect(history[0]).toEqual(`/samples/${sample.id}/analyses`);

            await userEvent.click(screen.getByText("Create"));

            await waitFor(() =>
                expect(history[1]).toEqual(
                    formatPath("", {
                        openCreateAnalysis: true,
                    }),
                ),
            );
        });
    });
});
