import { Button } from "@base";
import { IndexMinimal } from "@indexes/types";
import { MLModelMinimal } from "@ml/types";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Workflows } from "../../types";
import { CreateAnalysisFooter } from "./CreateAnalysisFooter";
import { CreateAnalysisInputError } from "./CreateAnalysisInputError";
import { CreateAnalysisSummary } from "./CreateAnalysisSummary";
import { IndexSelector } from "./IndexSelector";
import { MLModelSelector } from "./MLModelSelector";

type createIimiFormValues = {
    index: string;
    mlModel: string;
    workflow: Workflows;
};

type createIimiFormProps = {
    /** The indexes that are compatible with the selected sample */
    compatibleIndexes: IndexMinimal[];
    /** The available ML models */
    mlModels: MLModelMinimal[];
    /** The callback to call when the form is submitted */
    onSubmit: (values: createIimiFormValues) => void;
    /** The number of samples selected */
    sampleCount: number;
};

/**
 * Form for creating a new IIMI analysis.
 */
export function CreateIimiForm({ compatibleIndexes, mlModels, onSubmit, sampleCount }: createIimiFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<createIimiFormValues>({
        defaultValues: { workflow: Workflows.iimi },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <MLModelSelector models={mlModels} selected={value} onChange={onChange} />
                )}
                name="mlModel"
                rules={{ required: true }}
            />
            <CreateAnalysisInputError>{errors.mlModel && "An ml model must be selected"}</CreateAnalysisInputError>

            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <IndexSelector indexes={compatibleIndexes} selected={value} onChange={onChange} />
                )}
                name="index"
                rules={{ required: true }}
            />
            <CreateAnalysisInputError>{errors.index && "A reference must be selected"}</CreateAnalysisInputError>

            <CreateAnalysisFooter>
                <CreateAnalysisSummary sampleCount={sampleCount} indexCount={watch("index") ? 1 : 0} />
                <Button type="submit" color="blue">
                    Start
                </Button>
            </CreateAnalysisFooter>
        </form>
    );
}
