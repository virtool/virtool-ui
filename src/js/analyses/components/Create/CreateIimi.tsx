import { useCreateAnalysis } from "@analyses/queries";
import Button from "@base/Button";
import { useFindModels } from "@ml/queries";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Workflows } from "../../types";
import { CreateAnalysisFooter } from "./CreateAnalysisFooter";
import { CreateAnalysisInputError } from "./CreateAnalysisInputError";
import { CreateAnalysisSummary } from "./CreateAnalysisSummary";
import MlModelSelector from "./MlModelSelector";

type CreateIimiFormValues = {
    mlModel: string;
};

type CreateIimiProps = {
    /** The number of samples selected */
    sampleCount: number;

    /** The id of the sample being used */
    sampleId: string;
};

/**
 * Form for creating a new Iimi analysis.
 */
export default function CreateIimi({ sampleCount, sampleId }: CreateIimiProps) {
    const { data: mlModels, isPending: isPendingMlModels } = useFindModels();
    const createAnalysis = useCreateAnalysis();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateIimiFormValues>();

    if (isPendingMlModels) {
        return null;
    }

    function onSubmit(values: CreateIimiFormValues) {
        const { mlModel } = values;

        createAnalysis.mutate({
            mlModel,
            sampleId,
            workflow: Workflows.iimi,
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <MlModelSelector
                        models={mlModels.items}
                        selected={value}
                        onChange={onChange}
                    />
                )}
                name="mlModel"
                rules={{ required: true }}
            />
            <CreateAnalysisInputError>
                {errors.mlModel && "An ML model must be selected."}
            </CreateAnalysisInputError>

            <CreateAnalysisFooter>
                <CreateAnalysisSummary
                    sampleCount={sampleCount}
                    indexCount={0}
                />
                <Button type="submit" color="blue">
                    Start
                </Button>
            </CreateAnalysisFooter>
        </form>
    );
}
