import { BoxGroupSection } from "@/base";
import { cn } from "@/utils";
import Badge from "@base/Badge";
import { SampleMinimal } from "@samples/types";
import React from "react";
import { CreateAnalysisFieldTitle } from "./CreateAnalysisFieldTitle";

type SelectedSamplesProps = {
    /** The samples selected for the open quick analysis dialog. */
    samples: SampleMinimal[];
};

/**
 * Displays the sample selected for the analyses that will be started by the open
 * quick analysis dialog.
 */
export function SelectedSamples({ samples }: SelectedSamplesProps) {
    return (
        <>
            <CreateAnalysisFieldTitle>
                Compatible Samples <Badge>{samples.length}</Badge>
            </CreateAnalysisFieldTitle>
            <div
                className={cn(
                    "border",
                    "border-gray-300",
                    "mb-2",
                    "max-h-32",
                    "overflow-y-scroll",
                    "rounded-sm",
                )}
            >
                {samples.map(({ id, name }) => (
                    <BoxGroupSection key={id} disabled>
                        {name}
                    </BoxGroupSection>
                ))}
            </div>
        </>
    );
}
