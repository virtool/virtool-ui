import { map } from "lodash";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { BoxGroup, BoxGroupHeader, Table } from "../../base";

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
export function AnalysisRows({ sample_id, analysis_id }: AnalysisRowsProps) {
    return (
        <>
            <JobArgsRow title="Sample">
                <Link to={`/samples/${sample_id}`}>{sample_id}</Link>
            </JobArgsRow>
            <JobArgsRow title="Analysis">
                <Link to={`/samples/${sample_id}/analyses/${analysis_id}`}>{analysis_id}</Link>
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
export function BuildIndexRows({ index_id, ref_id }: BuildIndexRowsProps) {
    return (
        <>
            <JobArgsRow title="Reference">
                <Link to={`/refs/${ref_id}`}>{ref_id}</Link>
            </JobArgsRow>
            <JobArgsRow title="Index">
                <Link to={`/refs/${ref_id}/indexes/${index_id}`}>{index_id}</Link>
            </JobArgsRow>
        </>
    );
}

type CreateSampleRowsProps = {
    /** the unique identifier of the sample being created*/
    sample_id: string;
};

/** Rows showing important arguments when running an "create_sample" workflow. */
export function CreateSampleRows({ sample_id }: CreateSampleRowsProps) {
    return (
        <JobArgsRow title="Sample">
            <Link to={`/samples/${sample_id}`}>{sample_id}</Link>
        </JobArgsRow>
    );
}

type CreateSubtractionRowsProps = {
    /** the unique identifier of the created subtraction */
    subtraction_id: string;
};

/** Rows showing important arguments when running a "create_subtraction" workflow. */
export function CreateSubtractionRows({ subtraction_id }: CreateSubtractionRowsProps) {
    return (
        <JobArgsRow title="Subtraction">
            <Link to={`/subtractions/${subtraction_id}`}>{subtraction_id}</Link>
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

/**
 * Generic rows displaying the arguments passed to the job when the workflow type is not known.
 *
 * @param args - The  list of arguments used to run the job
 * @returns Table rows containing the arguments of the job
 */
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

type GenericArgs = AnalysisRowsProps & BuildIndexRowsProps & CreateSampleRowsProps & CreateSubtractionRowsProps;

type JobArgsRowsProps = {
    /** The workflow name */
    workflow: string;
    /** The complete list of arguments used to run the job */
    args: GenericArgs;
};

/**  The table rows containing arguments used to run a job.
 *
 * @param workflow - The workflow name
 */
export function JobArgsRows({ workflow, args }: JobArgsRowsProps) {
    switch (workflow) {
        case "build_index":
            return <BuildIndexRows {...args} />;

        case "create_sample":
            return <CreateSampleRows {...args} />;

        case "create_subtraction":
            return <CreateSubtractionRows {...args} />;

        case "aodp":
        case "nuvs":
        case "pathoscope_bowtie":
            return <AnalysisRows {...args} />;

        default:
            return <UnknownJobRows args={args} />;
    }
}

type JobArgsProps = {
    /** The workflow name */
    workflow: string;
    /** The complete list of arguments used to run the job */
    args: GenericArgs;
};

/** A table of arguments used to run a job. */
export function JobArgs({ workflow, args }: JobArgsProps) {
    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>Arguments</h2>
                <p>Run arguments that make this job unique.</p>
            </BoxGroupHeader>
            <Table>
                <tbody>
                    <JobArgsRows workflow={workflow} args={args} />
                </tbody>
            </Table>
        </BoxGroup>
    );
}
