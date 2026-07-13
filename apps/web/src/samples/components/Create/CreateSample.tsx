import { useFetchAccount } from "@account/queries";
import Button from "@base/Button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@base/Dialog";
import Icon from "@base/Icon";
import InputContainer from "@base/InputContainer";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputIconButton from "@base/InputIconButton";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import SaveButton from "@base/SaveButton";
import SideBarSection from "@base/SideBarSection";
import SidebarHeader from "@base/SidebarHeader";
import Switch from "@base/Switch";
import { usePersistentForm } from "@forms/hooks";
import { useListGroups } from "@groups/queries";
import type { Label } from "@labels/types";
import { useCreateSample } from "@samples/queries";
import { Clock, WandSparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useInfiniteFindFiles } from "@/uploads/queries";
import type { Upload } from "@/uploads/types";
import DefaultSubtractionSelector from "./DefaultSubtractionSelector";
import LabelSelector from "./LabelSelector";
import LibraryTypeSelector from "./LibraryTypeSelector";
import ReadSelector from "./ReadSelector";
import SampleUserGroup from "./SampleUserGroup";

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
	labels: number[];
	subtractionIds: string[];
};

type CreateSampleProps = {
	labels: Label[];
};

/**
 * A dialog for creating a sample. Caller provides labels.
 */
export default function CreateSample({ labels }: CreateSampleProps) {
	const [open, setOpen] = useState(false);

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
				files: readFiles,
				labels: sampleLabels,
				group: group || null,
			},
			{
				onSuccess: () => {
					reset();
					setOpen(false);
				},
			},
		);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Button as={DialogTrigger} color="blue">
				Create
			</Button>
			<DialogContent size="lg" className="max-h-[90vh] overflow-y-auto">
				<DialogTitle>Create Sample</DialogTitle>
				<InputError className="text-left">
					{mutation.isError && mutation.error.response?.body.message}
				</InputError>
				{isLoading ? (
					<LoadingPlaceholder className="mt-9" />
				) : (
					<form onSubmit={handleSubmit(onSubmit)}>
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

						<SideBarSection>
							<SidebarHeader>
								<span>Metadata</span>
								<Switch
									aria-label="Show metadata fields"
									checked={showMetadata}
									onCheckedChange={setShowMetadata}
								/>
							</SidebarHeader>
							<p className="text-gray-600 text-sm mb-0">
								Show fields for locale, isolate, and host.
							</p>
						</SideBarSection>

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

						<DialogFooter className="items-center justify-between">
							<p className="text-gray-600 text-sm flex items-center mb-0">
								<Icon icon={Clock} className="mr-[5px]" /> This will take some
								time.
							</p>
							<SaveButton />
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
