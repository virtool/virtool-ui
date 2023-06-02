import { forEach } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { checkAdminRoleOrPermission } from "../../administration/utils";
import { Alert, Icon, UploadBar } from "../../base";
import { createRandomString } from "../../utils/utils";
import { upload } from "../actions";

export const UploadToolbar = ({ canUpload, onDrop, fileType, message, validationRegex, tip }) => {
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

    const handleDrop = acceptedFiles => {
        onDrop(fileType, acceptedFiles);
    };

    const validateExtensions = file => (validationRegex.test(file.name) ? null : { code: "Invalid file type" });

    return (
        <UploadBar
            onDrop={handleDrop}
            message={message || "Drag file here to upload."}
            validator={validationRegex ? validateExtensions : null}
            tip={tip}
        />
    );
};

export const mapStateToProps = state => ({
    canUpload: checkAdminRoleOrPermission(state, "upload_file")
});

export const mapDispatchToProps = dispatch => ({
    onDrop: (fileType, acceptedFiles) => {
        forEach(acceptedFiles, file => {
            const localId = createRandomString();
            dispatch(upload(localId, file, fileType));
        });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadToolbar);
