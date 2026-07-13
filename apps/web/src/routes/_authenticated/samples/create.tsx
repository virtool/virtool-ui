import Alert from "@base/Alert";
import ContainerNarrow from "@base/ContainerNarrow";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@base/Empty";
import LinkButton from "@base/LinkButton";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { useFetchLabels } from "@labels/queries";
import CreateSampleForm from "@samples/components/Create/CreateSampleForm";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { uploadsQueryOptions, useFetchUploads } from "@uploads/queries";
import { FileUp, TriangleAlert } from "lucide-react";
import { z } from "zod/v4";

const uploadId = z.number().int().positive();

const createSampleSearchSchema = z.object({
	// A lone ``?upload=1`` parses as a number and repeats parse as an array.
	// Accept both so a hand-written URL works.
	upload: z
		.union([uploadId, z.array(uploadId)])
		.transform((value) => (Array.isArray(value) ? value : [value]))
		.default([])
		.catch([]),
});

export const Route = createFileRoute("/_authenticated/samples/create")({
	validateSearch: createSampleSearchSchema,
	loaderDeps: ({ search }) => ({ upload: search.upload }),
	loader: ({ context: { queryClient }, deps }) =>
		queryClient.ensureQueryData(uploadsQueryOptions("reads", deps.upload)),
	component: CreateSampleRoute,
});

function CreateSampleRoute() {
	const { upload: uploadIds } = Route.useSearch();
	const navigate = useNavigate();

	const {
		data: labels,
		isPending: isPendingLabels,
		isError: isErrorLabels,
	} = useFetchLabels();
	const {
		data: uploads,
		isPending: isPendingUploads,
		isError: isErrorUploads,
	} = useFetchUploads("reads", uploadIds);

	if (isErrorLabels && !labels) {
		return <QueryError noun="labels" />;
	}

	if (isErrorUploads && !uploads) {
		return <QueryError noun="read files" />;
	}

	if (isPendingLabels || isPendingUploads) {
		return <LoadingPlaceholder />;
	}

	// The ids come from the URL, so they may name a file that has since been
	// deleted, or reserved by someone else's sample. Order the ones that survived
	// the way they were asked for.
	const found = uploadIds.flatMap((id) => {
		const upload = uploads.find((candidate) => candidate.id === id);
		return upload ? [upload] : [];
	});

	const missingCount = uploadIds.length - found.length;

	return (
		<ContainerNarrow>
			<ViewHeader title="Create Sample">
				<ViewHeaderTitle>
					{found.length > 1 ? "Create Samples" : "Create Sample"}
				</ViewHeaderTitle>
			</ViewHeader>

			{missingCount > 0 && (
				<Alert color="orange" icon={TriangleAlert} level>
					<span>
						{missingCount === 1
							? "1 selected read file is no longer available."
							: `${missingCount} selected read files are no longer available.`}{" "}
						They may have been deleted, or used to create another sample.
					</span>
				</Alert>
			)}

			{found.length === 0 ? (
				<Empty className="h-72">
					<EmptyMedia className="text-gray-400">
						<FileUp size={40} strokeWidth={1.5} />
					</EmptyMedia>
					<EmptyTitle>No read files selected</EmptyTitle>
					<EmptyDescription>
						Choose the read files to create samples from in the file manager.
					</EmptyDescription>
					<LinkButton color="blue" to="/samples/files">
						Browse Read Files
					</LinkButton>
				</Empty>
			) : (
				<CreateSampleForm
					labels={labels}
					onCreated={() => navigate({ to: "/samples" })}
					uploads={found}
				/>
			)}
		</ContainerNarrow>
	);
}
