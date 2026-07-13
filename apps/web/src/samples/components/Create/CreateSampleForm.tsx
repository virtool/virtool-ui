import { useFetchAccount } from "@account/queries";
import BoxGroup from "@base/BoxGroup";
import InputError from "@base/InputError";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import SaveButton from "@base/SaveButton";
import Switch from "@base/Switch";
import { useListGroups } from "@groups/queries";
import type { Label } from "@labels/types";
import { useCreateSamples } from "@samples/queries";
import { getCreateSampleRequest } from "@samples/utils";
import { useFetchSubtractionsShortlist } from "@subtraction/queries";
import type { Upload } from "@uploads/types";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import CreateSampleRow from "./CreateSampleRow";
import {
	type CreateSampleFormValues,
	getCreateSampleFormValues,
	getSampleDrafts,
} from "./createSampleForm";
import LibraryTypeSelector from "./LibraryTypeSelector";
import SampleUserGroup from "./SampleUserGroup";

type CreateSampleFormProps = {
	/** All labels available for selection */
	labels: Label[];

	/** Called once every sample has been created */
	onCreated: () => void;

	/** The read files the samples will be created from */
	uploads: Upload[];
};

/**
 * Creates a sample from each of the given read files. Detected mate pairs
 * become one paired sample rather than two, so passing both mates yields a
 * single row.
 *
 * A sample the API rejects keeps its row and carries the reason, while the
 * siblings that were created are dropped — so a partial failure can be
 * corrected and retried instead of started over.
 */
export default function CreateSampleForm({
	labels,
	onCreated,
	uploads,
}: CreateSampleFormProps) {
	const { data: groups, isPending: isPendingGroups } = useListGroups();
	const { data: account, isPending: isPendingAccount } = useFetchAccount();
	const {
		data: subtractions,
		isPending: isPendingSubtractions,
		isError: isErrorSubtractions,
	} = useFetchSubtractionsShortlist();

	// The drafts are fixed for the life of the form: samples are created one
	// request at a time, and the rows must not shift under the user as they go.
	const [drafts] = useState(() => getSampleDrafts(uploads));
	const readsByKey = new Map(drafts.map((draft) => [draft.key, draft.reads]));

	const { control, handleSubmit, setValue } = useForm<CreateSampleFormValues>({
		defaultValues: getCreateSampleFormValues(drafts),
	});

	const { fields, remove } = useFieldArray({ control, name: "samples" });

	const mutation = useCreateSamples();

	const [failures, setFailures] = useState<Record<string, string>>({});
	const [showMetadata, setShowMetadata] = useState(false);

	useEffect(() => {
		setValue("group", String(account?.primary_group?.id ?? ""));
	}, [account, setValue]);

	function onSubmit({ group, libraryType, samples }: CreateSampleFormValues) {
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

				if (created.length === samples.length) {
					onCreated();
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

			<div className="flex items-center justify-end gap-2 pb-2">
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

			<BoxGroup>
				{fields.map((field, index) => (
					<CreateSampleRow
						control={control}
						failure={failures[field.key]}
						index={index}
						key={field.id}
						labels={labels}
						reads={readsByKey.get(field.key) ?? []}
						showMetadata={showMetadata}
						subtractions={subtractions}
					/>
				))}
			</BoxGroup>

			<div className="flex justify-end pt-4">
				<SaveButton
					altText={
						fields.length === 1
							? "Create Sample"
							: `Create ${fields.length} Samples`
					}
				/>
			</div>
		</form>
	);
}
