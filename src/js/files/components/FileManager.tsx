import { useFetchAccount } from "@account/queries";
import { checkAdminRoleOrPermissionsFromAccount } from "@administration/utils";
import { Permission } from "@groups/types";
import { map } from "lodash";
import { capitalize } from "lodash-es";
import React from "react";
import { Badge, BoxGroup, LoadingPlaceholder, NoneFoundBox, Pagination, ViewHeader, ViewHeaderTitle } from "../../base";
import { useListFiles } from "../queries";
import { FileResponse, FileType } from "../types";
import { File } from "./File";
import UploadToolbar from "./Toolbar";

type FileManagerProps = {
    /* The type of file accepted. */
    fileType: FileType;

    /* A message to display in the upload toolbar. */
    message: React.ReactNode;

    /* A tip to display in the upload toolbar. */
    regex?: RegExp;
};

export function FileManager({ fileType, message, regex }: FileManagerProps) {
    const page = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;

    const { data: account, isLoading: isLoadingAccount } = useFetchAccount();
    const { data: files, isLoading: isLoadingFiles }: { data: FileResponse; isLoading: boolean } = useListFiles(
        fileType,
        page,
        25
    );

    if (isLoadingFiles || isLoadingAccount) {
        return <LoadingPlaceholder />;
    }

    const canRemoveFiles = checkAdminRoleOrPermissionsFromAccount(account, Permission.remove_file);
    const title = `${fileType === "reads" ? "Read" : capitalize(fileType)} Files`;

    return (
        <>
            <ViewHeader title={title} />
            <ViewHeaderTitle>
                {title} <Badge>{files.found_count}</Badge>
            </ViewHeaderTitle>

            <UploadToolbar fileType={fileType} message={message} regex={regex} />

            {files.found_count === 0 ? (
                <NoneFoundBox noun="files" />
            ) : (
                <Pagination items={files.items} storedPage={files.page} currentPage={page} pageCount={files.page_count}>
                    <BoxGroup>
                        {map(files.items, item => (
                            <File {...item} canRemove={canRemoveFiles} key={item.id} />
                        ))}
                    </BoxGroup>
                </Pagination>
            )}
        </>
    );
}
