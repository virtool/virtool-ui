import { IndexMinimal } from "@indexes/types";
import { MLModelMinimal } from "@ml/types";
import { SubtractionShortlist } from "@subtraction/types";
import React from "react";
import { Workflows } from "../../types";
import { CreateIimiForm } from "./CreateIimiForm";
import { CreateNuvsForm } from "./CreateNuvsForm";
import { CreatePathoscopeForm } from "./CreatePathoscopeForm";

export type CreateAnalysisFormValues = {
    index: string;
    mlModel?: string;
    subtractions?: string[];
    workflow: Workflows;
};

type CreateAnalysisFormProps = {
    compatibleIndexes: IndexMinimal[];
    defaultSubtractions: string[];
    mlModels: MLModelMinimal[];
    onSubmit: (values: CreateAnalysisFormValues) => void;
    sampleCount: number;
    subtractions: SubtractionShortlist[];
    workflow: Workflows;
};

/**
 * Form for creating a new analysis of the given workflow type
 *
 * @param compatibleIndexes - The indexes that are compatible with the selected sample.
 * @param defaultSubtractions - The default subtractions to use.
 * @param mlModels - The available ML models.
 * @param onSubmit - The callback to call when the form is submitted.
 * @param sampleCount - The number of samples selected.
 * @param subtractions - The available subtractions.
 * @param workflow - The workflow type.
 */
export function CreateAnalysisForm({
    compatibleIndexes,
    defaultSubtractions,
    mlModels,
    onSubmit,
    sampleCount,
    subtractions,
    workflow,
}: CreateAnalysisFormProps) {
    if (workflow === Workflows.pathoscope_bowtie) {
        return (
            <CreatePathoscopeForm
                compatibleIndexes={compatibleIndexes}
                defaultSubtractions={defaultSubtractions}
                onSubmit={onSubmit}
                sampleCount={sampleCount}
                subtractions={subtractions}
            />
        );
    }

    if (workflow === Workflows.nuvs) {
        return (
            <CreateNuvsForm
                compatibleIndexes={compatibleIndexes}
                defaultSubtractions={defaultSubtractions}
                onSubmit={onSubmit}
                sampleCount={sampleCount}
                subtractions={subtractions}
            />
        );
    }
    if (workflow === Workflows.iimi) {
        return (
            <CreateIimiForm
                compatibleIndexes={compatibleIndexes}
                mlModels={mlModels}
                onSubmit={onSubmit}
                sampleCount={sampleCount}
            />
        );
    }

    return null;
}
