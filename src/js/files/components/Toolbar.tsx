import { forEach } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { useCheckAdminRoleOrPermission } from "../../administration/hooks";
import { Alert, Icon, UploadBar } from "../../base";
import { Permission } from "../../groups/types";
import { createRandomString } from "../../utils/utils";
import { upload } from "../actions";

type UploadToolbarProps = {
    onDrop: (fileType: string, acceptedFiles: File[]) => void;
    fileType: string;
    tip?: string;
    message?: React.ReactNode;
    /* For validating file type */
    validationRegex?: RegExp;
};

/*
 * Renders an UploadBar if the user has permission to upload files.
 */
export function UploadToolbar({ onDrop, fileType, message, validationRegex }: UploadToolbarProps) {
    const { hasPermission: canCreate } = useCheckAdminRoleOrPermission(Permission.create_ref);

    if (!canCreate) {
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

    function handleDrop(acceptedFiles: File[]) {
        onDrop(fileType, acceptedFiles);
    }

    function validateExtensions(file: File) {
        return validationRegex.test(file.name) ? null : { code: "Invalid file type", message: "File type not allowed" };
    }

    return (
        <UploadBar
            onDrop={handleDrop}
            message={message || "Drag file here to upload."}
            validator={validationRegex ? validateExtensions : null}
        />
    );
}

export function mapDispatchToProps(dispatch) {
    return {
        onDrop: (fileType: string, acceptedFiles: File[]) => {
            forEach(acceptedFiles, (file: File) => {
                const localId = createRandomString();
                dispatch(upload(localId, file, fileType));
            });
        },
    };
}

export default connect(null, mapDispatchToProps)(UploadToolbar);
