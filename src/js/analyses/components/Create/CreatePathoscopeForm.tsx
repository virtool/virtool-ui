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

type createPathoscopeFormValues = {
    workflow: Workflows;
    indexes: string[];
    subtractions: string[];
};

type createPathoscopeFormProps = {
    compatibleIndexes: IndexMinimal[];
    defaultSubtractions: string[];
    onSubmit: (values: createPathoscopeFormValues) => void;
    sampleCount: number;
    subtractions: Subtraction[];
};

/**
 * Form for creating a new Pathoscope analysis.
 * @param compatibleIndexes - The indexes that are compatible with the selected sample.
 * @param defaultSubtractions - The default subtractions to use.
 * @param onSubmit - The callback to call when the form is submitted.
 * @param sampleCount - The number of samples selected.
 * @param subtractions - The available subtractions.
 */
export function CreatePathoscopeForm({
    compatibleIndexes,
    defaultSubtractions,
    onSubmit,
    sampleCount,
    subtractions,
}: createPathoscopeFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<createPathoscopeFormValues>({
        defaultValues: { workflow: Workflows.pathoscope_bowtie, subtractions: defaultSubtractions },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <SubtractionSelector subtractions={subtractions} selected={value} onChange={onChange} />
                )}
                name={"subtractions"}
                defaultValue={[]}
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
