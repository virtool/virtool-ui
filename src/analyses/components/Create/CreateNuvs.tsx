import React from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "../../../base/Button";
import { useCompatibleIndexes, useSubtractionOptions } from "../../hooks";
import { useCreateAnalysis } from "../../queries";
import { Workflows } from "../../types";
import { CreateAnalysisFooter } from "./CreateAnalysisFooter";
import { CreateAnalysisInputError } from "./CreateAnalysisInputError";
import { CreateAnalysisSummary } from "./CreateAnalysisSummary";
import IndexSelector from "./IndexSelector";
import SubtractionSelector from "./SubtractionSelector";

type CreateNuvsFormValues = {
    indexId: string;
    subtractionIds: string[];
};

type CreateNuvsProps = {
    /** The number of samples selected */
    sampleCount: number;

    /** The id of the sample being used */
    sampleIds: string[];
};

/**
 * Form for creating a new NuVs analysis.
 */
export default function CreateNuvs({
    sampleCount,
    sampleIds,
}: CreateNuvsProps) {
    const { indexes, isPending: isPendingIndexes } = useCompatibleIndexes();

    const {
        defaultSubtractions,
        subtractions,
        isPending: isPendingSubtractions,
    } = useSubtractionOptions(sampleIds);

    const createAnalysis = useCreateAnalysis();

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<CreateNuvsFormValues>({
        defaultValues: {
            subtractionIds: defaultSubtractions.map(
                (subtraction) => subtraction.id,
            ),
        },
    });

    if (isPendingIndexes || isPendingSubtractions) {
        return null;
    }

    function onSubmit(values: CreateNuvsFormValues) {
        const { indexId, subtractionIds } = values;

        const refId = indexes.find((index) => index.id === indexId).reference
            .id;

        sampleIds.forEach((sampleId) =>
            createAnalysis.mutate({
                refId,
                subtractionIds,
                sampleId,
                workflow: Workflows.nuvs,
            }),
        );
    }

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
                name="subtractionIds"
            />

            <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                    <IndexSelector
                        indexes={indexes}
                        selected={value}
                        onChange={onChange}
                    />
                )}
                name="indexId"
                rules={{ required: true }}
            />

            <CreateAnalysisInputError>
                {errors.indexId && "A reference must be selected"}
            </CreateAnalysisInputError>

            <CreateAnalysisFooter>
                <CreateAnalysisSummary
                    sampleCount={sampleCount}
                    indexCount={watch("indexId") ? 1 : 0}
                />
                <Button type="submit" color="blue">
                    Start
                </Button>
            </CreateAnalysisFooter>
        </form>
    );
}
