import { useFetchAccount } from "@account/account";
import { checkAdminRoleOrPermissionsFromAccount } from "@administration/utils";
import Alert from "@base/Alert";
import Box from "@base/Box";
import BoxGroup from "@base/BoxGroup";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@base/Empty";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Pagination from "@base/Pagination";
import QueryError from "@base/QueryError";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "@base/ViewHeaderTitleBadge";
import { capitalize } from "es-toolkit";
import { AlertCircle, FileUp } from "lucide-react";
import type { ReactNode } from "react";
import type { Accept } from "react-dropzone";
import { useListFiles } from "../queries";
import type { UploadType } from "../types";
import { upload } from "../uploader";
import { UploadBar } from "./UploadBar";
import UploadItem from "./UploadItem";

export type FileManagerProps = {
	/* The MIME-types and extensions to accept. */
	accept: Accept;

	/* The type of file accepted. */
	fileType: UploadType;

	/* A message to display in the upload toolbar. */
	message?: ReactNode;

	page?: number;

	/* A regular expression to validate file names. */
	regex?: RegExp;

	setPage?: (page: number) => void;
};

export function FileManager({
	accept,
	fileType,
	message,
	page = 1,
	regex,
	setPage = () => {},
}: FileManagerProps) {
	const {
		data: account,
		isPending: isPendingAccount,
		isError: isErrorAccount,
	} = useFetchAccount();
	const {
		data: files,
		isPending: isPendingFiles,
		isError: isErrorFiles,
	} = useListFiles(fileType, page, 25);

	if (isErrorAccount && !account) {
		return <QueryError noun="account" />;
	}

	if (isErrorFiles && !files) {
		return <QueryError noun="files" />;
	}

	if (isPendingFiles || isPendingAccount) {
		return <LoadingPlaceholder />;
	}

	const canUpload = checkAdminRoleOrPermissionsFromAccount(
		account,
		"upload_file",
	);
	const canDelete = checkAdminRoleOrPermissionsFromAccount(
		account,
		"remove_file",
	);

	const title = `${fileType === "reads" ? "Read" : capitalize(fileType)} Files`;

	function handleDrop(acceptedFiles: File[]) {
		for (const file of acceptedFiles) {
			upload(file, fileType);
		}
	}

	return (
		<>
			<ViewHeader title={title}>
				<ViewHeaderTitle>
					{title}{" "}
					<ViewHeaderTitleBadge>{files.found_count}</ViewHeaderTitleBadge>
				</ViewHeaderTitle>
			</ViewHeader>

			{canUpload ? (
				<UploadBar
					accept={accept}
					onDrop={handleDrop}
					message={message || "Drag file here to upload"}
					regex={regex}
				/>
			) : (
				<Alert color="orange" level icon={AlertCircle}>
					<span>
						<strong>You do not have permission to upload files.</strong>
						<span> Contact an administrator.</span>
					</span>
				</Alert>
			)}

			{files.found_count === 0 ? (
				<Box>
					<Empty className="h-72">
						<EmptyMedia className="text-gray-400">
							<FileUp size={40} strokeWidth={1.5} />
						</EmptyMedia>
						<EmptyTitle>No files found</EmptyTitle>
						<EmptyDescription>
							{canUpload
								? "Upload a file to get started."
								: "No files have been uploaded yet."}
						</EmptyDescription>
					</Empty>
				</Box>
			) : (
				<Pagination
					items={files.items}
					storedPage={files.page}
					currentPage={page}
					pageCount={files.page_count}
					onPageChange={setPage}
				>
					<BoxGroup>
						{files.items.map((item) => (
							<UploadItem {...item} canDelete={canDelete} key={item.id} />
						))}
					</BoxGroup>
				</Pagination>
			)}
		</>
	);
}
