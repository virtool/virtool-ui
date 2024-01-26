import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../base";
import { IndexMinimal } from "../../../indexes/types";
import { MLModelMinimal } from "../../../ml/types";
import { Workflows } from "../../types";
import { CreateAnalysisFooter } from "./CreateAnalysisFooter";
import { CreateAnalysisInputError } from "./CreateAnalysisInputError";
import { CreateAnalysisSummary } from "./CreateAnalysisSummary";
import { IndexSelector } from "./IndexSelector";
import { MLModelSelector } from "./MLModelSelector";

type createIimiFormValues = {
    indexes: string[];
    mlModel: string;
    workflow: Workflows;
};

type createIimiFormProps = {
    compatibleIndexes: IndexMinimal[];
    mlModels: MLModelMinimal[];
    onSubmit: (values: createIimiFormValues) => void;
    sampleCount: number;
};

/**
 * Form for creating a new IIMI analysis.
 *
 * @param compatibleIndexes - The indexes that are compatible with the selected sample.
 * @param mlModels - The available ML models.
 * @param onSubmit - The callback to call when the form is submitted.
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
