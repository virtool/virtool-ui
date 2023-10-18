import { map } from "lodash";
import { startCase } from "lodash-es";
import React from "react";
import { Link } from "react-router-dom";
import { BoxGroup, BoxGroupHeader, Table } from "../../base";

function JobArgsRow({ children, title }) {
    return (
        <tr>
            <th>{title}</th>
            <td>{children}</td>
        </tr>
    );
}

/**
 * Rows showing important arguments when running a sample analysis workflow.
 *
 * @param args - The complete list of arguments used to run the job
 * @returns Table rows containing the arguments of the job
 */
export function AnalysisRows({ sample_id, analysis_id }: { sample_id: string; analysis_id: string }) {
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

/**
 * Rows showing important arguments when running an "build_index" workflow.
 *
 * @param args - The complete list of arguments used to run the job
 * @returns Table rows containing the arguments of the job
 */
export function BuildIndexRows({ index_id, ref_id }: { index_id: string; ref_id: string }) {
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

/**
 * Rows showing important arguments when running an "create_sample" workflow.
 *
 * @param args - The complete list of arguments used to run the job
 * @returns Table rows containing the arguments of the job
 */
export function CreateSampleRows({ sample_id }: { sample_id: string }) {
    return (
        <JobArgsRow title="Sample">
            <Link to={`/samples/${sample_id}`}>{sample_id}</Link>
        </JobArgsRow>
    );
}

/**
 * Rows showing important arguments when running an "create_subtraction" workflow.
 *
 * @param args - The complete list of arguments used to run the job
 * @returns Table rows containing the arguments of the job
 */
export function CreateSubtractionRows({ subtraction_id }: { subtraction_id: string }) {
    return (
        <JobArgsRow title="Subtraction">
            <Link to={`/subtractions/${subtraction_id}`}>{subtraction_id}</Link>
        </JobArgsRow>
    );
}

/**
 * Rows showing important arguments when running an "update_sample" workflow.
 *
 * @param args - The complete list of arguments used to run the job
 * @returns Table rows containing the arguments of the job
 */
export function UpdateSampleRows({ sample_id }: { sample_id: string }) {
    return (
        <JobArgsRow title="Subtraction">
            <Link to={`/samples/${sample_id}`}>{sample_id}</Link>
        </JobArgsRow>
    );
}

/**
 * Generic rows displaying the arguments passed to the job when the workflow type is not know.
 *
 * @param args - The complete list of arguments used to run the job
 * @returns Table rows containing the arguments of the job
 */
function GenericJobArgsRows({ args }: { args: { [key: string]: any } }) {
    return (
        <>
            {map(args, (value, key) => {
                if (typeof value === "string" || typeof value === "number") {
                    return (
                        <JobArgsRow key={key} title={startCase(key)}>
                            {value}
                        </JobArgsRow>
                    );
                }
            })}
        </>
    );
}

/**
 * The tabel rows containing arguments used to run a job.
 *
 * @param workflow - The workflow name
 * @param args - The complete list of arguments used to run the job
 * @returns Table rows containing arguments used to run a job
 */
export function JobArgsRows({ workflow, args }) {
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

        case "update_sample":
            return <UpdateSampleRows {...args} />;

        default:
            return <GenericJobArgsRows args={args} />;
    }
}

type JobArgsProps = {
    workflow: string;
    args: { [key: string]: any };
};

/**
 * A table of arguments used to run a job.
 *
 * @param workflow - The workflow name
 * @param args - The complete list of arguments used to run the job
 * @returns An table of arguments
 */
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
