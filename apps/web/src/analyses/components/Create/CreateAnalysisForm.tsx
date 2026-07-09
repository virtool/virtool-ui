import { useCompatibleIndexes, useSubtractionOptions } from "@analyses/hooks";
import { useCreateAnalysis } from "@analyses/queries";
import Button from "@base/Button";
import { DialogFooter } from "@base/Dialog";
import InputError from "@base/InputError";
import QueryError from "@base/QueryError";
import { Controller, useForm } from "react-hook-form";
import { CreateAnalysisSummary } from "./CreateAnalysisSummary";
import IndexSelector from "./IndexSelector";
import SubtractionSelector from "./SubtractionSelector";
import WorkflowSelector from "./WorkflowSelector";
import type { workflow } from "./workflows";

type CreateAnalysisFormValues = {
	indexId: string;
	subtractionIds: string[];
	workflow: string;
};

type CreateAnalysisFormProps = {
	/** The workflows compatible with the selected sample(s) */
	compatibleWorkflows: workflow[];

	/** The number of samples selected */
	sampleCount: number;

	/** The ids of the samples being analyzed */
	sampleIds: string[];
};

/**
 * Form for creating an analysis. The subtraction and reference inputs are
 * shared across every workflow, so the workflow is picked with a radio group
 * rather than switching between separate forms.
 */
export default function CreateAnalysisForm({
	compatibleWorkflows,
	sampleCount,
	sampleIds,
}: CreateAnalysisFormProps) {
	const {
		indexes,
		isPending: isPendingIndexes,
		isError: isErrorIndexes,
	} = useCompatibleIndexes();

	const {
		defaultSubtractions,
		subtractions,
		isPending: isPendingSubtractions,
		isError: isErrorSubtractions,
	} = useSubtractionOptions(sampleIds);

	const createAnalysis = useCreateAnalysis();

	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<CreateAnalysisFormValues>({
		defaultValues: {
			subtractionIds: defaultSubtractions.map((subtraction) => subtraction.id),
			workflow: compatibleWorkflows[0]?.id,
		},
	});

	if (isErrorIndexes || isErrorSubtractions) {
		return <QueryError noun="analysis options" />;
	}

	if (isPendingIndexes || isPendingSubtractions) {
		return null;
	}

	function onSubmit(values: CreateAnalysisFormValues) {
		const { indexId, subtractionIds, workflow } = values;

		const index = indexes.find((index) => index.id === indexId);
		if (!index) {
			return;
		}
		const refId = index.reference.id;

		for (const sampleId of sampleIds) {
			createAnalysis.mutate({
				refId,
				sampleId,
				subtractionIds,
				workflow,
			});
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{compatibleWorkflows.length > 1 && (
				<Controller
					control={control}
					name="workflow"
					render={({ field: { onChange, value } }) => (
						<WorkflowSelector
							workflows={compatibleWorkflows}
							selected={value}
							onChange={onChange}
						/>
					)}
				/>
			)}

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
						invalid={Boolean(errors.indexId)}
					/>
				)}
				rules={{ required: true }}
			/>

			<InputError className="mb-0">
				{errors.indexId && "A reference must be selected"}
			</InputError>

			<DialogFooter className="items-center justify-between">
				<CreateAnalysisSummary
					sampleCount={sampleCount}
					indexCount={watch("indexId") ? 1 : 0}
				/>
				<Button type="submit" color="blue">
					Create
				</Button>
			</DialogFooter>
		</form>
	);
}
