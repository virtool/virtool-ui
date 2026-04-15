import { formatIsolateName } from "@app/utils";
import { DialogFooter } from "@base/Dialog";
import Input from "@base/Input";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import SaveButton from "@base/SaveButton";
import { useForm } from "react-hook-form";
import { SourceType } from "./SourceType";

type IsolateFormValues = {
	sourceName: string;
	sourceType: string;
};

type IsolateFormProps = {
	sourceName?: string;
	sourceType?: string;
	/** Indicates whether the source types are restricted */
	restrictSourceTypes: boolean;
	/** A callback function to be called when the form is submitted */
	onSubmit: (values: IsolateFormValues) => void;
	allowedSourceTypes: string[];
};

/**
 * Form for creating an OTU isolate
 */
export default function IsolateForm({
	sourceName,
	sourceType,
	restrictSourceTypes,
	onSubmit,
	allowedSourceTypes,
}: IsolateFormProps) {
	const { register, handleSubmit, watch } = useForm({
		defaultValues: {
			sourceName: sourceName || "",
			sourceType: sourceType || (restrictSourceTypes ? "unknown" : ""),
		},
	});

	return (
		<form onSubmit={handleSubmit((values) => onSubmit({ ...values }))}>
			<div className="grid grid-cols-2 gap-4">
				<SourceType
					restrictSourceTypes={restrictSourceTypes}
					allowedSourceTypes={allowedSourceTypes}
					register={register}
					watch={watch}
				/>

				<InputGroup>
					<InputLabel htmlFor="sourceName">Source Name</InputLabel>
					<InputSimple
						id="sourceName"
						{...register("sourceName")}
						disabled={watch("sourceType").toLowerCase() === "unknown"}
					/>
				</InputGroup>
			</div>

			<InputGroup>
				<InputLabel htmlFor="isolateName">Isolate Name</InputLabel>
				<Input
					id="isolateName"
					value={formatIsolateName({
						sourceName: watch("sourceName"),
						sourceType: watch("sourceType"),
					})}
					readOnly
				/>
			</InputGroup>

			<DialogFooter>
				<SaveButton />
			</DialogFooter>
		</form>
	);
}
