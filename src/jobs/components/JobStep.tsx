import Badge from "@/base/Badge";
import BoxGroupSection from "@base/BoxGroupSection";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { marked } from "marked";
import type { JobState, JobStep } from "../types";
import JobStateIcon from "./JobStateIcon";

type JobStepProps = {
    state: JobState;
    step: JobStep;
};

/**
 * A condensed job step for use in a list of job steps
 */
export default function JobStepItem({ step, state }: JobStepProps) {
    return (
        <BoxGroupSection className="flex gap-2 items-start">
            <div className="items-center flex">
                <JobStateIcon state={state} />
            </div>

            <div className="">
                <h4 className="font-medium text-lg">{step.name}</h4>
                <p
                    dangerouslySetInnerHTML={{
                        __html: marked.parseInline(step.description),
                    }}
                />

                <div className="flex gap-4">
                    <Badge className="flex gap-1.5 items-center">
                        <Clock size={16} />
                        {format(new Date(step.startedAt), "HH:mm:ss")}
                    </Badge>
                    <Badge className="flex gap-1.5 items-center">
                        <Calendar size={16} />
                        {format(new Date(step.startedAt), "yyyy-MM-dd")}
                    </Badge>
                </div>
            </div>
        </BoxGroupSection>
    );
}
