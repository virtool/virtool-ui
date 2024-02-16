import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import nock from "nock";
import React from "react";
import { combineReducers } from "redux";
import { beforeEach, describe, expect, it } from "vitest";
import { createFakeAccount, mockAPIGetAccount } from "../../../../tests/fake/account";
import { createFakeAnalysisMinimal, mockApiGetAnalyses } from "../../../../tests/fake/analyses";
import { createFakeHMMSearchResults, mockApiGetHmms } from "../../../../tests/fake/hmm";
import { createFakeIndexMinimal } from "../../../../tests/fake/indexes";
import { createFakeSample, mockApiGetSampleDetail } from "../../../../tests/fake/samples";
import { createGenericReducer, renderWithRouter } from "../../../../tests/setupTests";
import { AdministratorRoles } from "../../../administration/types";
import { Workflows } from "../../types";
import AnalysesList from "../AnalysisList";

function createReducer(state, history) {
    return combineReducers({
        router: connectRouter(history),
        account: createGenericReducer(state.account),
        analyses: createGenericReducer(state.analyses),
        samples: createGenericReducer(state.samples),
    });
}

describe("<AnalysesList />", () => {
    let analyses;
    let history;
    let sample;
    let props;
    let state;

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
        state = {
            account: { administrator_role: AdministratorRoles.FULL },
            analyses: { readyIndexes: [createFakeIndexMinimal({ ready: true })] },
            samples: { detail: { subtractions: [] } },
        };
        history = createBrowserHistory();
    });

    afterEach(() => nock.cleanAll());

    describe("<AnalysesList />", () => {
        it("should render", async () => {
            renderWithRouter(<AnalysesList {...props} />, state, history, createReducer);

            expect(await screen.findByText("Pathoscope")).toBeInTheDocument();
            expect(screen.getByText(`${analyses[0].user.handle} created`)).toBeInTheDocument();
            expect(screen.getByText("NuVs")).toBeInTheDocument();
            expect(screen.getByText(`${analyses[1].user.handle} created`)).toBeInTheDocument();
        });
    });

    describe("<AnalysesToolbar />", () => {
        it("should show analysis creation when user is full admin", async () => {
            const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
            mockAPIGetAccount(account);

            mockApiGetSampleDetail(sample);

            renderWithRouter(<AnalysesList {...props} />, state, history, createReducer);

            expect(await screen.findByLabelText("plus-square fa-fw")).toBeInTheDocument();
        });

        it("should show analysis creation when user is the owner of the sample", async () => {
            const account = createFakeAccount({ administrator_role: null });
            mockAPIGetAccount(account);

            sample.user.id = account.id;
            mockApiGetSampleDetail(sample);

            renderWithRouter(<AnalysesList {...props} />, state, history, createReducer);

            expect(await screen.findByLabelText("plus-square fa-fw")).toBeInTheDocument();
        });

        it("should show analysis creation when user is in the correct group and write is enabled", async () => {
            const account = createFakeAccount({ administrator_role: null });
            mockAPIGetAccount(account);

            sample.groups = account.groups;
            sample.group_write = true;
            mockApiGetSampleDetail(sample);

            renderWithRouter(<AnalysesList {...props} />, state, history, createReducer);

            expect(await screen.findByLabelText("plus-square fa-fw")).toBeInTheDocument();
        });

        it("should show analysis creation when all users editing a sample is permitted", async () => {
            const account = createFakeAccount({ administrator_role: null });
            mockAPIGetAccount(account);

            sample.all_write = true;
            mockApiGetSampleDetail(sample);

            renderWithRouter(<AnalysesList {...props} />, state, history, createReducer);

            expect(await screen.findByLabelText("plus-square fa-fw")).toBeInTheDocument();
        });

        it("should not render analysis creation option when user has no permissions", async () => {
            const account = createFakeAccount({ administrator_role: null });
            mockAPIGetAccount(account);

            mockApiGetSampleDetail(sample);

            renderWithRouter(<AnalysesList {...props} />, state, history, createReducer);

            expect(screen.queryByLabelText("plus-square fa-fw")).toBeNull();
        });

        it("should change state once create analysis is clicked", async () => {
            const account = createFakeAccount({ administrator_role: AdministratorRoles.FULL });
            mockAPIGetAccount(account);
            mockApiGetSampleDetail(sample);
            renderWithRouter(<AnalysesList {...props} />, state, history, createReducer);

            expect(await screen.findByLabelText("plus-square fa-fw")).toBeInTheDocument();

            expect(history.location.state).toEqual(undefined);

            await userEvent.click(await screen.findByLabelText("plus-square fa-fw"));
            expect(history.location.state).toEqual({ createAnalysis: Workflows.pathoscope_bowtie });
        });
    });
});
