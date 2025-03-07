import Button from "@base/Button";
import { IndexMinimal } from "@indexes/types";
import { SubtractionShortlist } from "@subtraction/types";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Workflows } from "../../types";
import { CreateAnalysisFooter } from "./CreateAnalysisFooter";
import { CreateAnalysisInputError } from "./CreateAnalysisInputError";
import { CreateAnalysisSummary } from "./CreateAnalysisSummary";
import { IndexSelector } from "./IndexSelector";
import SubtractionSelector from "./SubtractionSelector";

type createNuvsFormValues = {
    workflow: Workflows;
    index: string;
    subtractions: string[];
};

type createNuvsFormProps = {
    /** The indexes that are compatible with the selected sample */
    compatibleIndexes: IndexMinimal[];
    /** The default subtractions to use */
    defaultSubtractions: string[];
    /** The callback to call when the form is submitted */
    onSubmit: (values: createNuvsFormValues) => void;
    /** The number of samples selected */
    sampleCount: number;
    /** The available subtractions */
    subtractions: SubtractionShortlist[];
};

/**
 * Form for creating a new NuVs analysis.
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
        defaultValues: {
            workflow: Workflows.nuvs,
            subtractions: defaultSubtractions,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <SubtractionSelector
                        subtractions={subtractions}
                        selected={value}
                        onChange={onChange}
                    />
                )}
                name="subtractions"
            />

            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <IndexSelector
                        indexes={compatibleIndexes}
                        selected={value}
                        onChange={onChange}
                    />
                )}
                name="index"
                rules={{ required: true }}
            />
            <CreateAnalysisInputError>
                {errors.index && "A reference must be selected"}
            </CreateAnalysisInputError>

            <CreateAnalysisFooter>
                <CreateAnalysisSummary
                    sampleCount={sampleCount}
                    indexCount={watch("index") ? 1 : 0}
                />
                <Button type="submit" color="blue">
                    Start
                </Button>
            </CreateAnalysisFooter>
        </form>
    );
}
