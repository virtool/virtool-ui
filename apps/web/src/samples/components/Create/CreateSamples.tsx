import { useFetchAccount } from "@account/queries";
import BoxGroup from "@base/BoxGroup";
import Button from "@base/Button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@base/Dialog";
import Icon from "@base/Icon";
import InputError from "@base/InputError";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import SaveButton from "@base/SaveButton";
import { useListGroups } from "@groups/queries";
import type { Label } from "@labels/types";
import { useCreateSamples } from "@samples/queries";
import { getCreateSampleRequest } from "@samples/utils";
import { useFetchSubtractionsShortlist } from "@subtraction/queries";
import type { Upload } from "@uploads/types";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import CreateSamplesRow from "./CreateSamplesRow";
import {
	type CreateSamplesFormValues,
	getCreateSamplesDefaultValues,
	getSampleDrafts,
} from "./createSamples";
import LibraryTypeSelector from "./LibraryTypeSelector";
import SampleUserGroup from "./SampleUserGroup";

type CreateSamplesFormProps = {
	/** All labels available for selection */
	labels: Label[];

	/** Closes the dialog once every sample has been created */
	onClose: () => void;

	/** Drops the read files of the created samples from the file selection */
	onCreated: (reads: Upload[]) => void;

	/** The selected read files the samples will be created from */
	uploads: Upload[];
};

function CreateSamplesForm({
	labels,
	onClose,
	onCreated,
	uploads,
}: CreateSamplesFormProps) {
	const { data: groups, isPending: isPendingGroups } = useListGroups();
	const { data: account, isPending: isPendingAccount } = useFetchAccount();
	const {
		data: subtractions,
		isPending: isPendingSubtractions,
		isError: isErrorSubtractions,
	} = useFetchSubtractionsShortlist();

	// The drafts are fixed for the life of the dialog: the uploads lists refetch
	// as samples are created, and the rows must not shift under the user.
	const [drafts] = useState(() => getSampleDrafts(uploads));
	const readsByKey = new Map(drafts.map((draft) => [draft.key, draft.reads]));

	const { control, handleSubmit, setValue } = useForm<CreateSamplesFormValues>({
		defaultValues: getCreateSamplesDefaultValues(drafts),
	});

	const { fields, remove } = useFieldArray({ control, name: "samples" });

	const mutation = useCreateSamples();

	const [failures, setFailures] = useState<Record<string, string>>({});

	useEffect(() => {
		setValue("group", String(account?.primary_group?.id ?? ""));
	}, [account, setValue]);

	function onSubmit({ group, libraryType, samples }: CreateSamplesFormValues) {
		const requests = samples.map((sample) =>
			getCreateSampleRequest(
				{ ...sample, group, libraryType },
				(readsByKey.get(sample.key) ?? []).map((read) => read.id),
			),
		);

		mutation.mutate(requests, {
			onSuccess: (outcomes) => {
				const created: string[] = [];
				const nextFailures: Record<string, string> = {};

				outcomes.forEach((outcome, index) => {
					const sample = samples[index];

					if (!sample) {
						return;
					}

					if (outcome.status === "created") {
						created.push(sample.key);
					} else {
						nextFailures[sample.key] = outcome.message;
					}
				});

				setFailures(nextFailures);
				onCreated(created.flatMap((key) => readsByKey.get(key) ?? []));

				if (created.length === samples.length) {
					onClose();
					return;
				}

				// Drop the samples that were created, leaving the ones that failed to
				// be corrected and retried rather than re-entered.
				remove(
					samples.flatMap((sample, index) =>
						created.includes(sample.key) ? [index] : [],
					),
				);
			},
		});
	}

	if (isErrorSubtractions && !subtractions) {
		return <QueryError noun="subtractions" />;
	}

	if (
		isPendingGroups ||
		isPendingAccount ||
		isPendingSubtractions ||
		!groups ||
		!subtractions
	) {
		return <LoadingPlaceholder className="mt-9" />;
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<InputError className="text-left">
				{mutation.isError && mutation.error.response?.body.message}
			</InputError>

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

			<Controller
				control={control}
				render={({ field: { onChange, value } }) => (
					<LibraryTypeSelector libraryType={value} onSelect={onChange} />
				)}
				name="libraryType"
			/>

			<BoxGroup>
				{fields.map((field, index) => (
					<CreateSamplesRow
						control={control}
						failure={failures[field.key]}
						index={index}
						key={field.id}
						labels={labels}
						reads={readsByKey.get(field.key) ?? []}
						subtractions={subtractions}
					/>
				))}
			</BoxGroup>

			<DialogFooter>
				<SaveButton
					altText={
						fields.length === 1
							? "Create Sample"
							: `Create ${fields.length} Samples`
					}
				/>
			</DialogFooter>
		</form>
	);
}

type CreateSamplesProps = {
	/** All labels available for selection */
	labels: Label[];

	/** Drops the read files of the created samples from the file selection */
	onCreated: (reads: Upload[]) => void;

	/** The selected read files the samples will be created from */
	uploads: Upload[];
};

/**
 * Creates a sample from each of the read files selected in the file manager.
 * Detected mate pairs become one paired sample rather than two, so selecting
 * both mates yields a single row.
 *
 * A sample the API rejects keeps its row and carries the reason, while the
 * siblings that were created are dropped — so a partial failure can be
 * corrected and retried instead of started over.
 */
export default function CreateSamples({
	labels,
	onCreated,
	uploads,
}: CreateSamplesProps) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Button as={DialogTrigger} color="blue" size="small">
				<Icon icon={CirclePlus} /> Create Samples
			</Button>
			<DialogContent size="lg" className="max-h-[90vh] overflow-y-auto">
				<DialogTitle>Create Samples</DialogTitle>
				<CreateSamplesForm
					labels={labels}
					onClose={() => setOpen(false)}
					onCreated={onCreated}
					uploads={uploads}
				/>
			</DialogContent>
		</Dialog>
	);
}
