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
import UploadToolbar from "./UploadToolbar";

type FileManagerProps = {
    message: React.ReactNode;
    fileType: FileType;
    validationRegex?: RegExp;
};

export function FileManager({ validationRegex, message, fileType }: FileManagerProps) {
    const URLPage = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;

    const { data: account, isLoading: isLoadingAccount } = useFetchAccount();
    const { data: files, isLoading: isLoadingFiles }: { data: FileResponse; isLoading: boolean } = useListFiles(
        fileType,
        URLPage,
        25,
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
            <UploadToolbar fileType={fileType} message={message} validationRegex={validationRegex} />

            {files.found_count === 0 ? (
                <NoneFoundBox noun="files" />
            ) : (
                <Pagination
                    items={files.items}
                    storedPage={files.page}
                    currentPage={URLPage}
                    pageCount={files.page_count}
                >
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
