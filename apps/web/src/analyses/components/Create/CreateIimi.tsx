import { useCompatibleIndexes } from "@analyses/hooks";
import { useCreateAnalysis } from "@analyses/queries";
import Button from "@base/Button";
import QueryError from "@base/QueryError";
import { useFindModels } from "@ml/queries";
import { Controller, useForm } from "react-hook-form";
import { CreateAnalysisFooter } from "./CreateAnalysisFooter";
import { CreateAnalysisInputError } from "./CreateAnalysisInputError";
import { CreateAnalysisSummary } from "./CreateAnalysisSummary";
import IndexSelector from "./IndexSelector";
import MlModelSelector from "./MlModelSelector";

type CreateIimiFormValues = {
	indexId: string;
	mlModel: string;
};

type CreateIimiProps = {
	/** The number of samples selected */
	sampleCount: number;

	/** The id of the sample being used */
	sampleIds: string[];
};

/**
 * Form for creating a new Iimi analysis.
 */
export default function CreateIimi({
	sampleCount,
	sampleIds,
}: CreateIimiProps) {
	const {
		indexes,
		isPending: isPendingIndexes,
		isError: isErrorIndexes,
	} = useCompatibleIndexes();
	const {
		data: mlModels,
		isPending: isPendingMlModels,
		isError: isErrorMlModels,
	} = useFindModels();

	const createAnalysis = useCreateAnalysis();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateIimiFormValues>();

	if (isErrorIndexes || isErrorMlModels) {
		return <QueryError noun="analysis options" />;
	}

	if (isPendingIndexes || isPendingMlModels) {
		return null;
	}

	function onSubmit(values: CreateIimiFormValues) {
		const { indexId, mlModel } = values;

		const index = indexes.find((index) => index.id === indexId);
		if (!index) {
			return;
		}
		const refId = index.reference.id;

		for (const sampleId of sampleIds) {
			createAnalysis.mutate({
				mlModel,
				refId,
				sampleId,
				workflow: "iimi",
			});
		}
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

			<CreateAnalysisFooter>
				<CreateAnalysisSummary sampleCount={sampleCount} indexCount={0} />
				<Button type="submit" color="blue">
					Start
				</Button>
			</CreateAnalysisFooter>
		</form>
	);
}
