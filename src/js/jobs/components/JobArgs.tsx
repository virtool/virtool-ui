import { BoxGroup, BoxGroupHeader, BoxGroupTable } from "@base";
import { map } from "lodash";
import React, { ReactNode } from "react";
import styled from "styled-components";
import { Link } from "wouter";
import { workflows } from "../types";

type JobArgsRowProps = {
    /** What to display as the value of the argument */
    children: ReactNode;
    /** The name of the job argument */
    title: string;
    /** An optional class name to apply to the row */
    className?: string;
};

/** A single row of the job arguments table. */
function JobArgsRow({ children, title, className }: JobArgsRowProps) {
    return (
        <tr className={className}>
            <th>{title}</th>
            <td>{children}</td>
        </tr>
    );
}

type AnalysisRowsProps = {
    /** The unique identified of the sample analysed */
    sample_id: string;
    /** The unique identified of the created analysis  */
    analysis_id: string;
};

/** Rows showing important arguments when running a sample analysis workflow */
function AnalysisRows({ sample_id, analysis_id }: AnalysisRowsProps) {
    return (
        <>
            <JobArgsRow title="Sample">
                <Link to={`/../../samples/${sample_id}`}>{sample_id}</Link>
            </JobArgsRow>
            <JobArgsRow title="Analysis">
                <Link to={`/../../samples/${sample_id}/analyses/${analysis_id}`}>{analysis_id}</Link>
            </JobArgsRow>
        </>
    );
}

type BuildIndexRowsProps = {
    /** The unique identifier of the index being built */
    index_id: string;
    /** The unique identifier of the reference the index is based on */
    ref_id: string;
};

/** Rows showing important arguments when running an "build_index" workflow. */
function BuildIndexRows({ index_id, ref_id }: BuildIndexRowsProps) {
    return (
        <>
            <JobArgsRow title="Reference">
                <Link to={`/../../refs/${ref_id}`}>{ref_id}</Link>
            </JobArgsRow>
            <JobArgsRow title="Index">
                <Link to={`/../../refs/${ref_id}/indexes/${index_id}`}>{index_id}</Link>
            </JobArgsRow>
        </>
    );
}

type CreateSampleRowsProps = {
    /** the unique identifier of the sample being created*/
    sample_id: string;
};

/** Rows showing important arguments when running an "create_sample" workflow. */
function CreateSampleRows({ sample_id }: CreateSampleRowsProps) {
    return (
        <JobArgsRow title="Sample">
            <Link to={`/../../samples/${sample_id}`}>{sample_id}</Link>
        </JobArgsRow>
    );
}

type CreateSubtractionRowsProps = {
    /** the unique identifier of the created subtraction */
    subtraction_id: string;
};

/** Rows showing important arguments when running a "create_subtraction" workflow. */
function CreateSubtractionRows({ subtraction_id }: CreateSubtractionRowsProps) {
    return (
        <JobArgsRow title="Subtraction">
            <Link to={`/../../subtractions/${subtraction_id}`}>{subtraction_id}</Link>
        </JobArgsRow>
    );
}

const UnsupportedJobArgsRow = styled(JobArgsRow)`
    th {
        font-weight: normal;
        font-family: monospace;
    }
`;

type UnknownJobRows = {
    /** The list of arguments used to run the job */
    args: object;
};

/** Generic rows displaying the arguments passed to the job when the workflow type is not known. */
function UnknownJobRows({ args }: UnknownJobRows) {
    return (
        <>
            {map(args, (value, key): ReactNode => {
                if (typeof value === "string" || typeof value === "number") {
                    return (
                        <UnsupportedJobArgsRow key={key} title={key}>
                            {value}
                        </UnsupportedJobArgsRow>
                    );
                }
                return null;
            })}
        </>
    );
}

type GenericJobArgsProps<workflowType, argsType> = {
    workflow: workflowType;
    args: argsType;
};

type JobArgsRowsProps =
    | GenericJobArgsProps<workflows.pathoscope_bowtie | workflows.nuvs | workflows.aodp, AnalysisRowsProps>
    | GenericJobArgsProps<workflows.build_index, BuildIndexRowsProps>
    | GenericJobArgsProps<workflows.create_sample, CreateSampleRowsProps>
    | GenericJobArgsProps<workflows.create_subtraction, CreateSubtractionRowsProps>;

/**  The table rows containing arguments used to run a job. */
function JobArgsRows({ workflow, args }: JobArgsRowsProps) {
    switch (workflow) {
        case workflows.build_index:
            return <BuildIndexRows {...args} />;

        case workflows.create_sample:
            return <CreateSampleRows {...args} />;

        case workflows.create_subtraction:
            return <CreateSubtractionRows {...args} />;

        case workflows.aodp:
        case workflows.nuvs:
        case workflows.pathoscope_bowtie:
            return <AnalysisRows {...args} />;

        default:
            return <UnknownJobRows args={args} />;
    }
}

/** A table of arguments used to run a job. */
export function JobArgs({ workflow, args }) {
    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>Arguments</h2>
                <p>Run arguments that make this job unique.</p>
            </BoxGroupHeader>
            <BoxGroupTable>
                <tbody>
                    <JobArgsRows workflow={workflow} args={args} />
                </tbody>
            </BoxGroupTable>
        </BoxGroup>
    );
}
