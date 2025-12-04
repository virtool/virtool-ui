import { screen } from "@testing-library/react";
import { renderWithRouter } from "@tests/setup";
import { describe, expect, it } from "vitest";
import JobArgs from "../JobArgs";

const workflows = [
    {
        workflow: "build_index",
        args: { index_id: "idx1", ref_id: "ref1" },
        links: [
            { name: "idx1", href: "/refs/ref1/indexes/idx1" },
            { name: "ref1", href: "/refs/ref1" },
        ],
    },
    {
        workflow: "create_sample",
        args: { sample_id: "smp1" },
        links: [{ name: "smp1", href: "/samples/smp1" }],
    },
    {
        workflow: "create_subtraction",
        args: { subtraction_id: "sub1" },
        links: [{ name: "sub1", href: "/subtractions/sub1" }],
    },
    {
        workflow: "pathoscope",
        args: { sample_id: "smp1", analysis_id: "anl1" },
        links: [
            { name: "smp1", href: "/samples/smp1" },
            { name: "anl1", href: "/samples/smp1/analyses/anl1" },
        ],
    },
    {
        workflow: "nuvs",
        args: { sample_id: "smp1", analysis_id: "anl1" },
        links: [
            { name: "smp1", href: "/samples/smp1" },
            { name: "anl1", href: "/samples/smp1/analyses/anl1" },
        ],
    },
];

describe("<JobArgs />", () => {
    it("should render basics correctly", () => {
        renderWithRouter(
            <JobArgs
                workflow="create_sample"
                args={{ sample_id: "test_sample_id" }}
            />,
        );

        expect(screen.getByText("Arguments")).toBeInTheDocument();
        expect(
            screen.getByText("Run arguments that make this job unique."),
        ).toBeInTheDocument();
    });

    it.each(workflows)(
        "should render $workflow jobs correctly",
        ({ workflow, args, links }) => {
            renderWithRouter(
                <JobArgs
                    workflow={workflow}
                    args={{ ...args, extra_param: "extra_param" }}
                />,
            );

            for (const { name, href } of links) {
                expect(screen.getByRole("link", { name })).toHaveAttribute(
                    "href",
                    href,
                );
            }
            expect(screen.queryByText("extra_param")).not.toBeInTheDocument();
        },
    );

    it("should render unknown workflows", () => {
        renderWithRouter(
            <JobArgs
                workflow="unknown_workflow"
                args={{
                    sample_id: "test_sample_id",
                    extra_param: "extra_param_id",
                    excluded_param: {},
                }}
            />,
        );

        expect(screen.getByText("test_sample_id")).toBeInTheDocument();
        expect(screen.queryByText("extra_param")).toBeInTheDocument();
        expect(screen.queryByText("extra_param_id")).toBeInTheDocument();
    });
});
