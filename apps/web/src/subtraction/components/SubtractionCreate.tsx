import { buttonVariants } from "@base/buttonVariants";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@base/Dialog";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import SaveButton from "@base/SaveButton";
import { RestoredAlert } from "@forms/components/RestoredAlert";
import { usePersistentForm } from "@forms/hooks";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useInfiniteFindFiles } from "@/uploads/queries";
import { useCreateSubtraction } from "../queries";
import { SubtractionFileSelector } from "./SubtractionFileSelector";

type FormValues = {
	name: string;
	nickname: string;
	uploadId: number[];
};

/**
 * Displays a dialog for creating a subtraction
 */
export default function SubtractionCreate() {
	const [open, setOpen] = useState(false);

	const {
		hasRestored,
		formState: { errors },
		control,
		register,
		handleSubmit,
		reset,
	} = usePersistentForm<FormValues>({
		formName: "createSubtraction",
		defaultValues: { name: "", nickname: "", uploadId: [] },
	});

	const {
		data: files,
		isPending,
		isFetchingNextPage,
		fetchNextPage,
	} = useInfiniteFindFiles("subtraction", 25);

	const mutation = useCreateSubtraction();

	function onSubmit({ name, nickname, uploadId }: FormValues) {
		const id = uploadId[0];
		if (id === undefined) {
			return;
		}

		mutation.mutate(
			{ name, nickname, uploadId: id },
			{
				onSuccess: () => {
					setOpen(false);
					reset();
				},
			},
		);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className={buttonVariants({ color: "blue" })}>
				Create
			</DialogTrigger>
			<DialogContent size="lg">
				<DialogTitle>Create Subtraction</DialogTitle>
				<DialogDescription>
					Create a new subtraction from a FASTA file.
				</DialogDescription>
				{isPending || !files ? (
					<LoadingPlaceholder className="mt-9" />
				) : (
					<form onSubmit={handleSubmit(onSubmit)}>
						<RestoredAlert
							hasRestored={hasRestored}
							name="subtraction"
							resetForm={reset}
						/>
						<InputGroup>
							<InputLabel htmlFor="name">Name</InputLabel>
							<InputSimple
								id="name"
								{...register("name", {
									required: "A name is required",
								})}
							/>
							<InputError>{errors.name?.message}</InputError>
						</InputGroup>

						<InputGroup>
							<InputLabel htmlFor="nickname">Nickname</InputLabel>
							<InputSimple id="nickname" {...register("nickname")} />
						</InputGroup>

						<InputLabel>Files</InputLabel>
						<Controller
							name="uploadId"
							control={control}
							render={({ field: { onChange, value } }) => (
								<SubtractionFileSelector
									onClick={onChange}
									error={errors.uploadId?.message ?? ""}
									files={files}
									isFetchingNextPage={isFetchingNextPage}
									fetchNextPage={fetchNextPage}
									isPending={isPending}
									foundCount={files.pages[0]?.found_count ?? 0}
									selected={value}
								/>
							)}
							rules={{ required: "Please select a file" }}
						/>
						<DialogFooter>
							<SaveButton />
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
