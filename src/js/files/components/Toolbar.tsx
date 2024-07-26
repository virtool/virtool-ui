import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import { Alert, Icon, UploadBar } from "@base";
import { FileType } from "@files/types";
import { upload } from "@files/uploader";
import { Permission } from "@groups/types";
import React from "react";

type UploadToolbarProps = {
    fileType: FileType;
    /* The type of file accepted. */

    message?: React.ReactNode;
    /* A message to display in the upload toolbar. */

    /* A regular expression to validate the filename against. */
    regex?: RegExp;
};

/*
 * Renders an UploadBar if the user has permission to upload files.
 */
export default function UploadToolbar({ fileType, message, regex }: UploadToolbarProps) {
    const { hasPermission: canUpload } = useCheckAdminRoleOrPermission(Permission.upload_file);

    if (!canUpload) {
        return (
            <Alert color="orange" level>
                <Icon name="exclamation-circle" />
                <span>
                    <strong>You do not have permission to upload files.</strong>
                    <span> Contact an administrator.</span>
                </span>
            </Alert>
        );
    }

    function validate(file: File) {
        if (!regex.test(file.name)) {
            return {
                code: "invalid_file_name",
                message: "Invalid file name",
            };
        }
    }

    function handleDrop(acceptedFiles: File[]) {
        for (const file of acceptedFiles) {
            upload(file, fileType);
        }
    }

    return (
        <UploadBar
            onDrop={handleDrop}
            message={message || "Drag file here to upload."}
            validator={regex ? validate : null}
        />
    );
}
