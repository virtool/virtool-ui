import { useFetchAccount } from "@account/queries";
import { cn } from "@app/utils";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@base/Dialog";
import IconButton from "@base/IconButton";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import SaveButton from "@base/SaveButton";
import Switch from "@base/Switch";
import { useListGroups } from "@groups/queries";
import type { Label } from "@labels/types";
import { useCreateSample } from "@samples/queries";
import { getSampleNameFromReads } from "@samples/utils";
import { buildReadRows } from "@uploads/pairing";
import type { Upload } from "@uploads/types";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DefaultSubtractionSelector from "./DefaultSubtractionSelector";
import LabelSelector from "./LabelSelector";
import LibraryTypeSelector from "./LibraryTypeSelector";
import SampleUserGroup from "./SampleUserGroup";

/**
 * The read files a sample created from ``upload`` will use: the file itself,
 * plus its mate in [LEFT, RIGHT] order when one is detected among ``uploads``.
 */
function getReads(upload: Upload, uploads: Upload[]): Upload[] {
	const row = buildReadRows(uploads).find((row) =>
		row.kind === "pair"
			? row.left.id === upload.id || row.right.id === upload.id
			: row.file.id === upload.id,
	);

	if (row?.kind === "pair") {
		return [row.left, row.right];
	}

	return [upload];
}

type ReadFilesProps = {
	/** The read files the sample will be created from, in [LEFT, RIGHT] order */
	reads: Upload[];
};

/**
 * The fixed read selection for the sample. The files come from the file the
 * dialog was opened on and can't be changed here.
 */
function ReadFiles({ reads }: ReadFilesProps) {
	const paired = reads.length > 1;

	return (
		<InputGroup>
			<div className="flex items-center justify-between">
				<InputLabel>Read Files</InputLabel>
				<span
					className={cn(
						"rounded-md text-xs font-bold px-2 py-0.5",
						paired
							? "bg-green-100 text-green-700"
							: "bg-gray-100 text-gray-500",
					)}
				>
					{paired ? "Paired" : "Unpaired"}
				</span>
			</div>
			<div className="flex gap-2">
				{reads.map((read, index) => (
					<div
						key={read.id}
						className="flex-1 min-w-0 rounded-md border border-gray-300 bg-gray-50 p-3"
					>
						<div className="text-xs font-bold text-gray-500 tracking-wide">
							{index === 0 ? "LEFT" : "RIGHT"}
							<span className="ml-1 font-medium text-gray-400">
								{index === 0 ? "R1" : "R2"}
							</span>
						</div>
						<div className="truncate font-mono font-medium mt-1">
							{read.name}
						</div>
					</div>
				))}
			</div>
		</InputGroup>
	);
}

type FormValues = {
	name: string;
	isolate: string;
	host: string;
	locale: string;
	libraryType: string;
	group: string;
	labels: number[];
	subtractionIds: string[];
};

type CreateSampleFromFileFormProps = {
	/** All labels available for selection */
	labels: Label[];

	/** Closes the dialog after a sample is created */
	onClose: () => void;

	/** The read files the sample will be created from, in [LEFT, RIGHT] order */
	reads: Upload[];
};

function CreateSampleFromFileForm({
	labels,
	onClose,
	reads,
}: CreateSampleFromFileFormProps) {
	const { data: groups, isPending: isPendingGroups } = useListGroups();
	const { data: account, isPending: isPendingAccount } = useFetchAccount();

	const {
		control,
		formState: { errors },
		handleSubmit,
		register,
		setValue,
	} = useForm<FormValues>({
		defaultValues: {
			name: getSampleNameFromReads(reads),
			isolate: "",
			host: "",
			locale: "",
			libraryType: "normal",
			group: "",
			labels: [],
			subtractionIds: [],
		},
	});

	const mutation = useCreateSample();

	const [showMetadata, setShowMetadata] = useState(false);

	useEffect(() => {
		setValue("group", String(account?.primary_group?.id ?? ""));
	}, [account, setValue]);

	function onSubmit({
		name,
		isolate,
		host,
		locale,
		libraryType,
		group,
		labels: sampleLabels,
		subtractionIds,
	}: FormValues) {
		mutation.mutate(
			{
				name,
				isolate,
				host,
				locale,
				libraryType,
				subtractions: subtractionIds,
				files: reads.map((read) => read.id),
				labels: sampleLabels,
				group: group || null,
			},
			{ onSuccess: onClose },
		);
	}

	return (
		<>
			<div className="flex items-center justify-between pb-4">
				<DialogTitle className="pb-0">Create Sample</DialogTitle>
				<div className="flex items-center gap-2">
					<label
						htmlFor="showMetadata"
						className="font-medium text-gray-600 text-sm"
					>
						Metadata Fields
					</label>
					<Switch
						id="showMetadata"
						checked={showMetadata}
						onCheckedChange={setShowMetadata}
					/>
				</div>
			</div>

			<InputError className="text-left">
				{mutation.isError && mutation.error.response?.body.message}
			</InputError>

			{isPendingGroups || isPendingAccount || !groups ? (
				<LoadingPlaceholder className="mt-9" />
			) : (
				<form onSubmit={handleSubmit(onSubmit)}>
					<ReadFiles reads={reads} />

					<InputGroup>
						<InputLabel htmlFor="name">Name</InputLabel>
						<InputSimple
							id="name"
							{...register("name", { required: "Required Field" })}
						/>
						<InputError>{errors.name?.message}</InputError>
					</InputGroup>

					<Controller
						control={control}
						render={({ field: { onChange, value } }) => (
							<SampleUserGroup
								selected={value}
								groups={groups}
								onChange={onChange}
							/>
						)}
						name="group"
					/>

					{showMetadata && (
						<div className="grid grid-cols-3 gap-x-4">
							<InputGroup>
								<InputLabel htmlFor="locale">Locale</InputLabel>
								<InputSimple id="locale" {...register("locale")} />
							</InputGroup>

							<InputGroup>
								<InputLabel htmlFor="isolate">Isolate</InputLabel>
								<InputSimple id="isolate" {...register("isolate")} />
							</InputGroup>

							<InputGroup>
								<InputLabel htmlFor="host">Host</InputLabel>
								<InputSimple id="host" {...register("host")} />
							</InputGroup>
						</div>
					)}

					<Controller
						control={control}
						render={({ field: { onChange, value } }) => (
							<LibraryTypeSelector libraryType={value} onSelect={onChange} />
						)}
						name="libraryType"
					/>

					<Controller
						control={control}
						render={({ field: { onChange, value } }) => (
							<LabelSelector
								labels={labels}
								selected={value}
								onChange={onChange}
							/>
						)}
						name="labels"
					/>

					<Controller
						control={control}
						render={({ field: { onChange, value } }) => (
							<DefaultSubtractionSelector
								selected={value}
								onChange={onChange}
							/>
						)}
						name="subtractionIds"
					/>

					<DialogFooter>
						<SaveButton />
					</DialogFooter>
				</form>
			)}
		</>
	);
}

type CreateSampleFromFileProps = {
	/** All labels available for selection */
	labels: Label[];

	/** The read file the sample will be created from */
	upload: Upload;

	/** The read files listed alongside ``upload``, used to detect its mate */
	uploads: Upload[];
};

/**
 * Creates a sample from a read file in the file manager. The read selection is
 * fixed to that file — and its mate, when one is detected — but every other
 * field of the sample can be set here.
 */
export default function CreateSampleFromFile({
	labels,
	upload,
	uploads,
}: CreateSampleFromFileProps) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<IconButton
				as={DialogTrigger}
				color="blue"
				IconComponent={CirclePlus}
				tip="create sample"
			/>
			<DialogContent size="lg" className="max-h-[90vh] overflow-y-auto">
				<CreateSampleFromFileForm
					labels={labels}
					onClose={() => setOpen(false)}
					reads={getReads(upload, uploads)}
				/>
			</DialogContent>
		</Dialog>
	);
}
