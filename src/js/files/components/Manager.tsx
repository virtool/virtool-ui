import { capitalize } from "lodash-es";
import React from "react";
import { useFetchAccount } from "../../account/querys";
import { checkAdminRoleOrPermissionsFromAccount } from "../../administration/utils";
import { Badge, LoadingPlaceholder, NoneFoundBox, Pagination, ViewHeader, ViewHeaderTitle } from "../../base";
import { Permission } from "../../groups/types";
import { useListFiles } from "../querys";
import { File as fileTyping, FileResponse, FileType } from "../types";
import { File } from "./File";
import UploadToolbar from "./Toolbar";
const renderRow = (canRemoveFiles: boolean) => (item: fileTyping) =>
    <File {...item} canRemove={canRemoveFiles} key={item.id} />;

type FileManagerProps = {
    tip: string;
    message: React.ReactNode;
    fileType: FileType;
    validationRegex?: RegExp;
};

export function FileManager({ validationRegex, message, tip, fileType }: FileManagerProps) {
    const URLPage = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;

    const { data: account, isLoading: isLoadingAccount } = useFetchAccount();
    const { data: files, isLoading: isLoadingFiles }: { data: FileResponse; isLoading: boolean } = useListFiles(
        fileType,
        true,
        URLPage,
    );

    if (isLoadingFiles || isLoadingAccount) {
        return <LoadingPlaceholder />;
    }

    const canRemoveFiles = checkAdminRoleOrPermissionsFromAccount(account, Permission.remove_file);

    const noneFound = files.found_count === 0 && <NoneFoundBox noun="files" />;

    const title = `${fileType === "reads" ? "Read" : capitalize(fileType)} Files`;

    return (
        <>
            <ViewHeader title={title} />
            <ViewHeaderTitle>
                {title} <Badge>{files.found_count}</Badge>
            </ViewHeaderTitle>
            <UploadToolbar fileType={fileType} message={message} validationRegex={validationRegex} tip={tip} />
            {noneFound}

            <Pagination
                items={files.items}
                renderRow={renderRow(canRemoveFiles)}
                storedPage={files.page}
                currentPage={URLPage}
                pageCount={files.page_count}
            />
        </>
    );
}
