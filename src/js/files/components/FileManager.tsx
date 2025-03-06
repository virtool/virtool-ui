import {
    Alert,
    BoxGroup,
    Icon,
    LoadingPlaceholder,
    NoneFoundBox,
    Pagination,
    ViewHeader,
    ViewHeaderTitle,
} from "@/base";
import { usePageParam } from "@/hooks";
import { useFetchAccount } from "@account/queries";
import { checkAdminRoleOrPermissionsFromAccount } from "@administration/utils";
import { ViewHeaderTitleBadge } from "@base/ViewHeaderTitleBadge";
import { UploadBar } from "@files/components/UploadBar";
import { upload } from "@files/uploader";
import { Permission } from "@groups/types";
import { map } from "lodash";
import { capitalize } from "lodash-es";
import React from "react";
import { Accept } from "react-dropzone";
import { useListFiles } from "../queries";
import { FileType } from "../types";
import FileItem from "./FileItem";

export type FileManagerProps = {
    /* The MIME-types and extensions to accept. */
    accept: Accept;

    /* The type of file accepted. */
    fileType: FileType;

    /* A message to display in the upload toolbar. */
    message?: React.ReactNode;

    /* A regular expression to validate file names. */
    regex?: RegExp;
};

export function FileManager({
    accept,
    fileType,
    message,
    regex,
}: FileManagerProps) {
    const { page } = usePageParam();

    const { data: account, isPending: isPendingAccount } = useFetchAccount();
    const { data: files, isPending: isPendingFiles } = useListFiles(
        fileType,
        page,
        25,
    );

    if (isPendingFiles || isPendingAccount) {
        return <LoadingPlaceholder />;
    }

    const canUpload = checkAdminRoleOrPermissionsFromAccount(
        account,
        Permission.upload_file,
    );
    const canDelete = checkAdminRoleOrPermissionsFromAccount(
        account,
        Permission.remove_file,
    );

    const title = `${fileType === "reads" ? "Read" : capitalize(fileType)} Files`;

    function handleDrop(acceptedFiles: File[]) {
        for (const file of acceptedFiles) {
            upload(file, fileType);
        }
    }

    return (
        <>
            <ViewHeader title={title} />
            <ViewHeaderTitle>
                {title}{" "}
                <ViewHeaderTitleBadge>{files.found_count}</ViewHeaderTitleBadge>
            </ViewHeaderTitle>

            {canUpload ? (
                <UploadBar
                    accept={accept}
                    onDrop={handleDrop}
                    message={message || "Drag file here to upload"}
                    regex={regex}
                />
            ) : (
                <Alert color="orange" level>
                    <Icon name="exclamation-circle" />
                    <span>
                        <strong>
                            You do not have permission to upload files.
                        </strong>
                        <span> Contact an administrator.</span>
                    </span>
                </Alert>
            )}

            {files.found_count === 0 ? (
                <NoneFoundBox noun="files" />
            ) : (
                <Pagination
                    items={files.items}
                    storedPage={files.page}
                    currentPage={page}
                    pageCount={files.page_count}
                >
                    <BoxGroup>
                        {map(files.items, (item) => (
                            <FileItem
                                {...item}
                                canDelete={canDelete}
                                key={item.id}
                            />
                        ))}
                    </BoxGroup>
                </Pagination>
            )}
        </>
    );
}
