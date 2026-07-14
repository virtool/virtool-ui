import { useFetchAccount } from "@account/queries";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@base/Collapsible";
import ContainerNarrow from "@base/ContainerNarrow";
import InputContainer from "@base/InputContainer";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputIconButton from "@base/InputIconButton";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import SaveButton from "@base/SaveButton";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { usePersistentForm } from "@forms/hooks";
import { useListGroups } from "@groups/queries";
import type { Label } from "@labels/types";
import { useCreateSample } from "@samples/queries";
import { getCreateSampleRequest, getSampleNameFromReads } from "@samples/utils";
import { useNavigate } from "@tanstack/react-router";
import { useInfiniteFindFiles } from "@uploads/queries";
import { WandSparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import DefaultSubtractionSelector from "./DefaultSubtractionSelector";
import LabelSelector from "./LabelSelector";
import LibraryTypeSelector from "./LibraryTypeSelector";
import ReadSelector from "./ReadSelector";
import SampleUserGroup from "./SampleUserGroup";

type FormValues = {
	name: string;
	isolate: string;
	host: string;
	locale: string;
	libraryType: string;
	readFiles: number[];
	group: string;
	labels: number[];
	subtractionIds: string[];
};

type CreateSampleProps = {
	labels: Label[];
};

/**
 * A page for creating a sample. Caller provides labels.
 */
export default function CreateSample({ labels }: CreateSampleProps) {
	const navigate = useNavigate();

	const { data: groups, isPending: isPendingGroups } = useListGroups();
	const { data: account, isPending: isPendingAccount } = useFetchAccount();
	const {
		data: readsResponse,
		isPending: isPendingReads,
		isFetchingNextPage,
		fetchNextPage,
	} = useInfiniteFindFiles("reads", 25);
	const {
		control,
		formState: { errors },
		handleSubmit,
		register,
		reset,
		setValue,
		watch,
	} = usePersistentForm<FormValues>({
		formName: "createSample",
		defaultValues: {
			name: "",
			isolate: "",
			host: "",
			locale: "",
			libraryType: "normal",
			readFiles: [],
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

	const reads = readsResponse?.pages.flatMap((page) => page.items) ?? [];
	const isLoading =
		isPendingReads ||
		isPendingGroups ||
		isPendingAccount ||
		!readsResponse ||
		!groups;

	function autofill(selected: number[]) {
		const selectedReads = selected.flatMap((id) => {
			const file = reads.find((read) => read.id === id);
			return file ? [file] : [];
		});

		const name = getSampleNameFromReads(selectedReads);

		if (name) {
			setValue("name", name);
		}
	}

	function onSubmit(values: FormValues) {
		mutation.mutate(getCreateSampleRequest(values, values.readFiles), {
			onSuccess: () => {
				reset();
				navigate({ to: "/samples" });
			},
		});
	}

	return (
		<ContainerNarrow>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ViewHeader title="Create Sample">
					<ViewHeaderTitle>Create Sample</ViewHeaderTitle>
					<InputError className="text-left">
						{mutation.isError && mutation.error.response?.body.message}
					</InputError>
				</ViewHeader>

				{isLoading ? (
					<LoadingPlaceholder className="mt-9" />
				) : (
					<>
						<InputGroup>
							<InputLabel htmlFor="name">Name</InputLabel>
							<InputContainer align="right" className="flex">
								<InputSimple
									id="name"
									{...register("name", {
										required: "Required Field",
									})}
								/>
								{Boolean(watch("readFiles").length) && (
									<InputIconButton
										IconComponent={WandSparkles}
										aria-label="Auto Fill"
										tip="Auto Fill"
										onClick={() => autofill(watch("readFiles"))}
									/>
								)}
							</InputContainer>
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

						<Collapsible
							className="mb-4"
							open={showMetadata}
							onOpenChange={setShowMetadata}
						>
							<CollapsibleTrigger>Show Metadata Fields</CollapsibleTrigger>
							<CollapsibleContent className="grid grid-cols-2 gap-x-[15px] pt-4">
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
							</CollapsibleContent>
						</Collapsible>

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

						<Controller
							control={control}
							render={({ field: { onChange, value } }) => (
								<ReadSelector
									data={readsResponse}
									isFetchingNextPage={isFetchingNextPage}
									fetchNextPage={fetchNextPage}
									isPending={isPendingReads}
									selected={value}
									onSelect={onChange}
									error={errors.readFiles?.message}
								/>
							)}
							name="readFiles"
							rules={{
								required:
									"At least one read file must be attached to the sample",
							}}
						/>

						{/* Sticky so the action stays in reach while the read selector is
						    scrolled, without leaving the end of the form. */}
						<div className="sticky bottom-0 flex justify-end border-gray-300 border-t bg-white py-4">
							<SaveButton />
						</div>
					</>
				)}
			</form>
		</ContainerNarrow>
	);
}
