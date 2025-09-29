import { useCompatibleIndexes, useSubtractionOptions } from "@analyses/hooks";
import { useCreateAnalysis } from "@analyses/queries";
import { Workflows } from "@analyses/types";
import Button from "@base/Button";
import { Controller, useForm } from "react-hook-form";
import { CreateAnalysisFooter } from "./CreateAnalysisFooter";
import { CreateAnalysisInputError } from "./CreateAnalysisInputError";
import { CreateAnalysisSummary } from "./CreateAnalysisSummary";
import IndexSelector from "./IndexSelector";
import SubtractionSelector from "./SubtractionSelector";

type CreatePathoscopeFormValues = {
    indexId: string;
    subtractionIds: string[];
};

type CreatePathoscopeProps = {
    /** The number of samples selected */
    sampleCount: number;

    /** The id of the sample being used */
    sampleIds: string[];
};

/**
 * Form for creating a new Pathoscope analysis.
 */
export default function CreatePathoscope({
    sampleCount,
    sampleIds,
}: CreatePathoscopeProps) {
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
    } = useForm<CreatePathoscopeFormValues>({
        defaultValues: {
            subtractionIds: defaultSubtractions.map(
                (subtraction) => subtraction.id,
            ),
        },
    });

    if (isPendingIndexes || isPendingSubtractions) {
        return null;
    }

    function onSubmit(values: CreatePathoscopeFormValues) {
        const { indexId, subtractionIds } = values;

        const refId = indexes.find((index) => index.id === indexId).reference
            .id;

        sampleIds.forEach((sampleId) =>
            createAnalysis.mutate({
                refId,
                sampleId,
                subtractionIds,
                workflow: Workflows.pathoscope_bowtie,
            }),
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="subtractionIds"
                render={({ field: { onChange, value } }) => (
                    <SubtractionSelector
                        subtractions={subtractions}
                        selected={value}
                        onChange={onChange}
                    />
                )}
            />

            <Controller
                control={control}
                name="indexId"
                render={({ field: { onChange, value } }) => (
                    <IndexSelector
                        indexes={indexes}
                        selected={value}
                        onChange={onChange}
                    />
                )}
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
