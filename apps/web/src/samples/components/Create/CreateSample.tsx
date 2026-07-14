import { useFetchAccount } from "@account/account";
import Box from "@base/Box";
import Icon from "@base/Icon";
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
import { useListGroups } from "@groups/queries";
import type { Label } from "@labels/types";
import { useCreateSample } from "@samples/queries";
import { useNavigate } from "@tanstack/react-router";
import { Clock, WandSparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useInfiniteFindFiles } from "@/uploads/queries";
import type { Upload } from "@/uploads/types";
import LibraryTypeSelector from "./LibraryTypeSelector";
import ReadSelector from "./ReadSelector";
import SampleUserGroup from "./SampleUserGroup";
import Sidebar from "./Sidebar";

const extensionRegex = /^(.*)\.(fq|fastq|fa|fasta)(\.gz)?$/i;

/**
 * Gets a filename without extension, given the file ID and an array of all available read uploads.
 * Used to autofill the name for a new sample based on the selected read file(s).
 *
 * @param id - the file ID
 * @param uploads - all available read uploads
 * @returns The filename without its extension
 */
function getFileNameFromId(id: number, uploads: Upload[]): string {
	const file = uploads.find((file) => file.id === id);
	const match = file?.name.match(extensionRegex);
	return match?.[1] ?? "";
}

type FormValues = {
	name: string;
	isolate: string;
	host: string;
	locale: string;
	libraryType: string;
	readFiles: number[];
	group: string;
	sidebar: { labels: number[]; subtractionIds: string[] };
};

type CreateSampleProps = {
	labels: Label[];
};

/**
 * A form for creating a sample. Caller provides labels.
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
	} = useForm<FormValues>({
		defaultValues: {
			name: "",
			isolate: "",
			host: "",
			locale: "",
			libraryType: "normal",
			readFiles: [],
			group: "",
			sidebar: {
				labels: [],
				subtractionIds: [],
			},
		},
	});
	const mutation = useCreateSample();

	const [showMetadata, setShowMetadata] = useState(false);

	useEffect(() => {
		setValue("group", String(account?.primary_group?.id ?? ""));
	}, [account, setValue]);

	if (
		isPendingReads ||
		isPendingGroups ||
		isPendingAccount ||
		!readsResponse ||
		!groups
	) {
		return <LoadingPlaceholder className="mt-9" />;
	}

	const reads = readsResponse.pages.flatMap((page) => page.items);

	function autofill(selected: number[]) {
		const id = selected[0];
		if (id === undefined) {
			return;
		}

		const fileName = getFileNameFromId(id, reads);
		if (fileName) {
			setValue("name", fileName);
		}
	}

	function onSubmit({
		name,
		isolate,
		host,
		locale,
		libraryType,
		readFiles,
		group,
		sidebar,
	}: FormValues) {
		const { labels, subtractionIds } = sidebar;

		mutation.mutate(
			{
				name,
				isolate,
				host,
				locale,
				libraryType,
				subtractions: subtractionIds,
				files: readFiles,
				labels,
				group: group || null,
			},
			{
				onSuccess: () => {
					reset();
					navigate({ to: "/samples" });
				},
			},
		);
	}

	return (
		<>
			<ViewHeader title="Create Sample">
				<ViewHeaderTitle>Create Sample</ViewHeaderTitle>
				<InputError className="text-left">
					{mutation.isError && mutation.error.response?.body.message}
				</InputError>
			</ViewHeader>
			<form
				className="grid grid-cols-[minmax(0,1150px)_max(320px,10%)] gap-x-[15px]"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="col-start-1">
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

					{showMetadata && (
						<div className="grid grid-cols-2 gap-x-[15px] mb-4">
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
							required: "At least one read file must be attached to the sample",
						}}
					/>
				</div>

				<div className="col-start-2">
					<Box className="flex items-center bg-blue-200 border-none mt-6 p-[15px]">
						<SaveButton altText="Create" />
						<p className="text-blue-800 font-medium ml-auto pl-4 text-center flex items-center mb-0">
							<Icon icon={Clock} className="mr-[5px]" /> This will take some
							time.
						</p>
					</Box>

					<Controller
						control={control}
						render={({ field: { value } }) => (
							<Sidebar
								defaultSubtractions={value.subtractionIds}
								labels={labels}
								onShowMetadataChange={setShowMetadata}
								onUpdate={setValue}
								sampleLabels={value.labels}
								showMetadata={showMetadata}
							/>
						)}
						name="sidebar"
					/>
				</div>
			</form>
		</>
	);
}
