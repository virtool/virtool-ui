import { useListSearchParam } from "@app/hooks";
import BoxGroup from "@base/BoxGroup";
import SidebarHeader from "@base/SidebarHeader";
import SideBarSection from "@base/SideBarSection";
import { JobCounts, JobState, jobStateToLegacy } from "@jobs/types";
import { xor } from "es-toolkit";
import { StateButton } from "./StateButton";

function getCount(counts: JobCounts, state: JobState): number {
    if (!counts) {
        return 0;
    }

    const legacyStates = jobStateToLegacy[state];

    return legacyStates.reduce((sum, legacy) => {
        const workflowCounts = counts[legacy];

        if (workflowCounts) {
            return (
                sum +
                Object.values(workflowCounts).reduce(
                    (result, value) => result + (value ?? 0),
                    0,
                )
            );
        }
        return sum;
    }, 0);
}

type StateFilterProps = {
    counts: JobCounts;
};

/**
 * Displays the state filtering for jobs
 */
export default function StateFilter({ counts }: StateFilterProps) {
    const { values: states, setValues: setStates } =
        useListSearchParam<JobState>("state");

    function handleClick(state: JobState) {
        setStates(xor(states, [state]));
    }

    return (
        <SideBarSection className="items-center m-0 relative z-0">
            <SidebarHeader>State</SidebarHeader>
            <BoxGroup>
                <StateButton
                    active={states.includes("pending")}
                    count={getCount(counts, "pending")}
                    label="pending"
                    onClick={() => handleClick("pending")}
                />
                <StateButton
                    active={states.includes("running")}
                    count={getCount(counts, "running")}
                    label="running"
                    onClick={() => handleClick("running")}
                />
                <StateButton
                    active={states.includes("succeeded")}
                    count={getCount(counts, "succeeded")}
                    label="succeeded"
                    onClick={() => handleClick("succeeded")}
                />
                <StateButton
                    active={states.includes("cancelled")}
                    count={getCount(counts, "cancelled")}
                    label="cancelled"
                    onClick={() => handleClick("cancelled")}
                />
                <StateButton
                    active={states.includes("failed")}
                    count={getCount(counts, "failed")}
                    label="failed"
                    onClick={() => handleClick("failed")}
                />
            </BoxGroup>
        </SideBarSection>
    );
}
