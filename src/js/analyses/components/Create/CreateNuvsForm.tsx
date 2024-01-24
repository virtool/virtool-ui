import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../base";
import { IndexMinimal } from "../../../indexes/types";
import { Subtraction } from "../../../subtraction/types";
import { Workflows } from "../../types";
import { CreateAnalysisFooter } from "./CreateAnalysisFooter";
import { CreateAnalysisInputError } from "./CreateAnalysisInputError";
import { CreateAnalysisSummary } from "./CreateAnalysisSummary";
import { IndexSelector } from "./IndexSelector";
import { SubtractionSelector } from "./SubtractionSelector";

type createNuvsFormValues = {
    workflow: Workflows;
    indexes: string[];
    subtractions: string[];
};

type createNuvsFormProps = {
    compatibleIndexes: IndexMinimal[];
    defaultSubtractions: string[];
    onSubmit: (values: createNuvsFormValues) => void;
    sampleCount: number;
    subtractions: Subtraction[];
};

/**
 * Form for creating a new NuVs analysis.
 *
 * @param compatibleIndexes - The indexes that are compatible with the selected sample.
 * @param defaultSubtractions - The default subtractions to use.
 * @param onSubmit - The callback to call when the form is submitted.
 * @param sampleCount - The number of samples selected.
 * @param subtractions - The available subtractions.
 */
export function CreateNuvsForm({
    compatibleIndexes,
    defaultSubtractions,
    onSubmit,
    sampleCount,
    subtractions,
}: createNuvsFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<createNuvsFormValues>({
        defaultValues: { workflow: Workflows.nuvs, subtractions: defaultSubtractions },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <SubtractionSelector subtractions={subtractions} selected={value} onChange={onChange} />
                )}
                name={"subtractions"}
            />

            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <IndexSelector indexes={compatibleIndexes} selected={value} onChange={onChange} />
                )}
                name="indexes"
                defaultValue={[]}
                rules={{ required: true }}
            />
            <CreateAnalysisInputError>{errors.indexes && "A reference must be selected"}</CreateAnalysisInputError>

            <CreateAnalysisFooter>
                <CreateAnalysisSummary sampleCount={sampleCount} indexCount={watch("indexes")?.length ?? 0} />
                <Button type="submit" color="blue" icon="play">
                    Start
                </Button>
            </CreateAnalysisFooter>
        </form>
    );
}
