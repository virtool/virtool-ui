import BoxGroupSection from "@base/BoxGroupSection";
import InputError from "@base/InputError";
import InputSimple from "@base/InputSimple";
import type { Label } from "@labels/types";
import SubtractionSelector from "@subtraction/components/SubtractionSelector";
import type { SubtractionOption } from "@subtraction/types";
import type { Upload } from "@uploads/types";
import { type Control, useController } from "react-hook-form";
import type { CreateSampleFormValues } from "./createSampleForm";
import LabelSelector from "./LabelSelector";
import ReadPairBadge from "./ReadPairBadge";

type MetadataFieldProps = {
	control: Control<CreateSampleFormValues>;
	fileName: string;
	index: number;
	label: string;
	name: "host" | "isolate" | "locale";
};

function MetadataField({
	control,
	fileName,
	index,
	label,
	name,
}: MetadataFieldProps) {
	const { field } = useController({
		control,
		name: `samples.${index}.${name}`,
	});

	return (
		<div>
			<span className="block text-sm text-gray-600 mb-1">{label}</span>
			<InputSimple {...field} aria-label={`${label} for ${fileName}`} />
		</div>
	);
}

type CreateSampleRowProps = {
	/** The form the row's fields belong to */
	control: Control<CreateSampleFormValues>;

	/** The message from the API when this sample could not be created */
	failure?: string;

	/** The row's position in the form's list of samples */
	index: number;

	/** All labels available for selection */
	labels: Label[];

	/** The read files the sample will be created from, in [LEFT, RIGHT] order */
	reads: Upload[];

	/** Whether to collect the optional metadata fields */
	showMetadata: boolean;

	/** All subtractions available for selection */
	subtractions: SubtractionOption[];
};

/**
 * One sample in the create-sample form. Its read files are fixed — they come
 * from the uploads named in the URL — while its name, labels, subtractions, and
 * optional metadata are set here.
 *
 * Each field is named after the sample's first read file, so that the rows'
 * controls are distinguishable from one another.
 */
export default function CreateSampleRow({
	control,
	failure,
	index,
	labels,
	reads,
	showMetadata,
	subtractions,
}: CreateSampleRowProps) {
	const {
		field: name,
		fieldState: { error: nameError },
	} = useController({
		control,
		name: `samples.${index}.name`,
		rules: { required: "Required Field" },
	});

	const { field: sampleLabels } = useController({
		control,
		name: `samples.${index}.labels`,
	});

	const { field: subtractionIds } = useController({
		control,
		name: `samples.${index}.subtractionIds`,
	});

	const fileName = reads[0]?.name ?? "";

	return (
		<BoxGroupSection className="flex flex-col gap-3">
			<div className="flex items-start gap-4">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1.5">
						<span className="text-xs font-bold text-gray-500 tracking-wide">
							READ FILES
						</span>
						<ReadPairBadge count={reads.length} />
					</div>
					{reads.map((read, readIndex) => (
						<div key={read.id} className="flex items-baseline gap-2 min-w-0">
							<span className="shrink-0 text-xs font-bold text-gray-400">
								{readIndex === 0 ? "R1" : "R2"}
							</span>
							<span className="truncate font-mono text-sm">{read.name}</span>
						</div>
					))}
				</div>
				<div className="flex-1 min-w-0">
					<InputSimple {...name} aria-label={`Name for ${fileName}`} />
					<InputError>{nameError?.message}</InputError>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<LabelSelector
					className="mb-0"
					hideEmptyHint
					hideLabel
					label={`Labels for ${fileName}`}
					labels={labels}
					onChange={sampleLabels.onChange}
					selected={sampleLabels.value}
				/>
				<SubtractionSelector
					className="mb-0"
					hideEmptyHint
					hideLabel
					label={`Subtractions for ${fileName}`}
					onChange={subtractionIds.onChange}
					selected={subtractionIds.value}
					subtractions={subtractions}
				/>
			</div>

			{showMetadata && (
				<div className="grid grid-cols-3 gap-4">
					<MetadataField
						control={control}
						fileName={fileName}
						index={index}
						label="Locale"
						name="locale"
					/>
					<MetadataField
						control={control}
						fileName={fileName}
						index={index}
						label="Isolate"
						name="isolate"
					/>
					<MetadataField
						control={control}
						fileName={fileName}
						index={index}
						label="Host"
						name="host"
					/>
				</div>
			)}

			{failure && <InputError>{failure}</InputError>}
		</BoxGroupSection>
	);
}
