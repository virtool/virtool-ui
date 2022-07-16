import {
    ARCHIVE_JOB,
    CANCEL_JOB,
    FIND_JOBS,
    GET_JOB,
    WS_INSERT_JOB,
    WS_REMOVE_JOB,
    WS_UPDATE_JOB
} from "../../app/actionTypes";
import { archiveJob, cancelJob, findJobs, getJob, wsInsertJob, wsRemoveJob, wsUpdateJob } from "../actions";

describe("Jobs Action Creators:", () => {
    it("wsInsertJob: returns action for job insert via websocket", () => {
        const data = {};
        const result = wsInsertJob(data);
        expect(result).toEqual({
            type: WS_INSERT_JOB,
            payload: { ...data }
        });
    });

    it("wsUpdateJob: returns action for job update via websocket", () => {
        const data = {};
        const result = wsUpdateJob(data);
        expect(result).toEqual({
            type: WS_UPDATE_JOB,
            payload: { ...data }
        });
    });

    it("wsRemoveJob: returns action for job removal via websocket", () => {
        const data = ["tester"];
        const result = wsRemoveJob(data);
        expect(result).toEqual({
            type: WS_REMOVE_JOB,
            payload: data
        });
    });

    it("findJobs: returns action to retrieve specific page of job documents", () => {
        const page = 2;
        const result = findJobs(page);
        expect(result).toEqual({
            type: FIND_JOBS.REQUESTED,
            payload: { page, archived: false }
        });
    });

    it("getJob: returns action for getting a specific job", () => {
        const jobId = "tester";
        const result = getJob(jobId);
        expect(result).toEqual({
            type: GET_JOB.REQUESTED,
            payload: { jobId }
        });
    });

    it("cancelJob: returns action for cancelling running job", () => {
        const jobId = "tester";
        const result = cancelJob(jobId);
        expect(result).toEqual({
            type: CANCEL_JOB.REQUESTED,
            payload: { jobId }
        });
    });

    it("ArchiveJob: returns action for archiving a specific job", () => {
        const jobId = "tester";
        const result = archiveJob(jobId);
        expect(result).toEqual({
            type: ARCHIVE_JOB.REQUESTED,
            payload: { jobId }
        });
    });
});
