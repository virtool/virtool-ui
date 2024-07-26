import { AdministratorRoles } from "@administration/types";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import nock from "nock";
import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeAccount, mockApiGetAccount } from "../../../../tests/fake/account";
import { createFakeAnalysisMinimal, mockApiGetAnalyses } from "../../../../tests/fake/analyses";
import { createFakeHMMSearchResults, mockApiGetHmms } from "../../../../tests/fake/hmm";
import { createFakeSample, mockApiGetSampleDetail } from "../../../../tests/fake/samples";
import { renderWithRouter } from "../../../../tests/setupTests";
import { Workflows } from "../../types";
import AnalysesList from "../AnalysisList";

describe("<AnalysesList />", () => {
    let analyses;
    let history;
    let sample;
    let props;

    beforeEach(() => {
        sample = createFakeSample();

        analyses = [
            createFakeAnalysisMinimal({ sample: { id: sample.id } }),
            createFakeAnalysisMinimal({ sample: { id: sample.id }, workflow: "nuvs" }),
        ];
        mockApiGetAnalyses(analyses);
        mockApiGetHmms(createFakeHMMSearchResults());
        props = {
            match: { params: { sampleId: analyses[0].sample.id } },
        };
        history = createBrowserHistory();
    });

    afterEach(() => nock.cleanAll());

    describe("<AnalysesList />", () => {
        it("should render", async () => {
            mockApiGetSampleDetail(sample);
            renderWithRouter(<AnalysesList {...props} />, {}, history);

            expect(await screen.findByText("Pathoscope")).toBeInTheDocument();
            expect(screen.getByText(`${analyses[0].user.handle} created`)).toBeInTheDocument();
            expect(screen.getByText("NuVs")).toBeInTheDocument();
            expect(screen.getByText(`${analyses[1].user.handle} created`)).toBeInTheDocument();
        });
    });

    describe("<AnalysesToolbar />", () => {
        it("should show analysis creation when user is full admin", async () => {
            const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
            mockApiGetAccount(account);
            mockApiGetSampleDetail(sample);
            renderWithRouter(<AnalysesList {...props} />, {}, history);

            expect(await screen.findByText("Create")).toBeInTheDocument();
        });

        it("should show analysis creation when user is the owner of the sample", async () => {
            const account = createFakeAccount({ administrator_role: null });
            sample.user.id = account.id;
            mockApiGetAccount(account);
            mockApiGetSampleDetail(sample);
            renderWithRouter(<AnalysesList {...props} />, {}, history);

            expect(await screen.findByText("Create")).toBeInTheDocument();
        });

        it("should show analysis creation when user is in the correct group and write is enabled", async () => {
            const account = createFakeAccount({ administrator_role: null });
            sample.group = account.groups[0].id;
            sample.group_write = true;
            mockApiGetAccount(account);
            mockApiGetSampleDetail(sample);
            renderWithRouter(<AnalysesList {...props} />, {}, history);

            expect(await screen.findByText("Create")).toBeInTheDocument();
        });

        it("should show analysis creation when all users editing a sample is permitted", async () => {
            const account = createFakeAccount({ administrator_role: null });
            mockApiGetAccount(account);

            sample.all_write = true;
            mockApiGetSampleDetail(sample);

            renderWithRouter(<AnalysesList {...props} />, {}, history);

            expect(await screen.findByText("Create")).toBeInTheDocument();
        });

        it("should not render analysis creation option when user has no permissions", async () => {
            const account = createFakeAccount({ administrator_role: null });
            mockApiGetAccount(account);
            mockApiGetSampleDetail(sample);
            renderWithRouter(<AnalysesList {...props} />, {}, history);

            expect(await screen.queryByText("Create")).not.toBeInTheDocument();
        });

        it("should change state once create analysis is clicked", async () => {
            const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });

            mockApiGetAccount(account);
            mockApiGetSampleDetail(sample);
            renderWithRouter(<AnalysesList {...props} />, {}, history);

            expect(await screen.findByText("Create")).toBeInTheDocument();
            expect(history.location.state).toEqual(undefined);

            await userEvent.click(screen.getByText("Create"));

            expect(history.location.state).toEqual({ createAnalysis: Workflows.pathoscope_bowtie });
        });
    });
});
