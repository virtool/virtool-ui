import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupTable from "@base/BoxGroupTable";
import Link from "@base/Link";
import { map } from "lodash-es";
import { ReactNode } from "react";

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
                <Link to={`/samples/${sample_id}`}>{sample_id}</Link>
            </JobArgsRow>
            <JobArgsRow title="Analysis">
                <Link to={`/samples/${sample_id}/analyses/${analysis_id}`}>
                    {analysis_id}
                </Link>
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
                <Link to={`/refs/${ref_id}`}>{ref_id}</Link>
            </JobArgsRow>
            <JobArgsRow title="Index">
                <Link to={`/refs/${ref_id}/indexes/${index_id}`}>
                    {index_id}
                </Link>
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
            <Link to={`/samples/${sample_id}`}>{sample_id}</Link>
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
            <Link to={`/subtractions/${subtraction_id}`}>{subtraction_id}</Link>
        </JobArgsRow>
    );
}

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
                        <JobArgsRow
                            className="font-mono font-normal"
                            key={key}
                            title={key}
                        >
                            {value}
                        </JobArgsRow>
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
    | GenericJobArgsProps<"pathoscope" | "nuvs", AnalysisRowsProps>
    | GenericJobArgsProps<"build_index", BuildIndexRowsProps>
    | GenericJobArgsProps<"create_sample", CreateSampleRowsProps>
    | GenericJobArgsProps<"create_subtraction", CreateSubtractionRowsProps>;

/**  The table rows containing arguments used to run a job. */
function JobArgsRows({ workflow, args }: JobArgsRowsProps) {
    switch (workflow) {
        case "build_index":
            return <BuildIndexRows {...args} />;

        case "create_sample":
            return <CreateSampleRows {...args} />;

        case "create_subtraction":
            return <CreateSubtractionRows {...args} />;

        case "nuvs":
        case "pathoscope":
            return <AnalysisRows {...args} />;

        default:
            return <UnknownJobRows args={args} />;
    }
}

/** A table of arguments used to run a job. */
export default function JobArgs({ workflow, args }) {
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
