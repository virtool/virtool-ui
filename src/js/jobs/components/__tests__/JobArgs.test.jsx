import CreateBrowserHistory from "history/es/createBrowserHistory";
import { forEach } from "lodash-es";
import React from "react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "../../../../tests/setupTests";
import { JobArgs } from "../JobArgs";

const sample_id = "test_sample_id";
const analysis_id = "test_analysis-id";
const ref_id = "test_reference-id";
const index_id = "test_index-id";
const subtraction_id = "test_subtraction-id";

const sample_url = { id: sample_id, url: `/samples/${sample_id}` };
const analysis_url = { id: analysis_id, url: `/samples/${sample_id}/analyses/${analysis_id}` };
const reference_url = { id: ref_id, url: `/refs/${ref_id}` };
const index_url = { id: index_id, url: `/refs/${ref_id}/indexes/${index_id}` };
const subtraction_url = { id: subtraction_id, url: `/subtractions/${subtraction_id}` };

const workflowTests = [
    { workflow: "aodp", args: { sample_id, analysis_id }, urls: [sample_url, analysis_url] },
    { workflow: "build_index", args: { index_id, ref_id }, urls: [index_url, reference_url] },
    { workflow: "create_sample", args: { sample_id }, urls: [sample_url] },
    { workflow: "create_subtraction", args: { subtraction_id }, urls: [subtraction_url] },
    { workflow: "pathoscope_bowtie", args: { sample_id, analysis_id }, urls: [sample_url, analysis_url] },
    { workflow: "nuvs", args: { sample_id, analysis_id }, urls: [sample_url, analysis_url] },
];

describe("<JobArgs />", () => {
    it("Should render basics correctly", () => {
        renderWithRouter(
            <JobArgs workflow={"create_sample"} args={{ sample_id: "test_sample_id" }} />,
            {},
            CreateBrowserHistory(),
        );

        expect(screen.getByText("Arguments")).toBeInTheDocument();
        expect(screen.getByText("Run arguments that make this job unique.")).toBeInTheDocument();
    });

    it.each(workflowTests)("Should render $workflow jobs correctly", ({ workflow, args, urls }) => {
        renderWithRouter(
            <JobArgs workflow={workflow} args={{ ...args, extra_param: "extra_param" }} />,
            {},
            CreateBrowserHistory(),
        );

        forEach(urls, ({ id, url }) => {
            expect(screen.getByRole("link", { name: id })).toHaveAttribute("href", url);
        });
        expect(screen.queryByText("extra_param")).not.toBeInTheDocument();
    });

    it("Should render correctly render unknown workflows", () => {
        renderWithRouter(
            <JobArgs
                workflow={"unknown_workflow"}
                args={{ sample_id: "test_sample_id", extra_param: "extra_param_id", excluded_param: {} }}
            />,
            {},
            CreateBrowserHistory(),
        );

        expect(screen.getByText("test_sample_id")).toBeInTheDocument();
        expect(screen.queryByText("extra_param")).toBeInTheDocument();
        expect(screen.queryByText("extra_param_id")).toBeInTheDocument();
    });
});
