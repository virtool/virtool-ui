import { capitalize, forEach, toString } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
    Alert,
    Badge,
    Icon,
    LoadingPlaceholder,
    NoneFoundBox,
    UploadBar,
    ViewHeader,
    ViewHeaderTitle,
    Pagination
} from "../../base";
import { checkAdminOrPermission, createRandomString } from "../../utils/utils";
import { findFiles, upload } from "../actions";
import { getFilteredFileIds } from "../selectors";
import File from "./File";

export const FileManager = ({
    onLoadNextPage,
    canUpload,
    onDrop,
    documents,
    validationRegex,
    message,
    total_count,
    page,
    tip,
    fileType,
    page_count,
    urlPage,
    stale,
    loading,
    found_count
}) => {
    useEffect(() => {
        if (stale || loading) {
            onLoadNextPage(fileType, "1", urlPage);
        }
    }, [stale]);

    if (loading) {
        return <LoadingPlaceholder />;
    }

    const handleDrop = acceptedFiles => {
        if (canUpload) {
            onDrop(fileType, acceptedFiles);
        }
    };

    const renderRow = index => {
        const id = documents[index];
        return <File key={id} id={id} />;
    };

    const validateExtensions = file => {
        return validationRegex.test(file.name) ? null : { code: "Invalid file type" };
    };

    let toolbar;

    if (canUpload) {
        toolbar = (
            <UploadBar
                onDrop={handleDrop}
                message={message || "Drag file here to upload."}
                validator={validationRegex ? validateExtensions : null}
                tip={tip}
            />
        );
    } else {
        toolbar = (
            <Alert color="orange" level>
                <Icon name="exclamation-circle" />
                <span>
                    <strong>You do not have permission to upload files.</strong>
                    <span> Contact an administrator.</span>
                </span>
            </Alert>
        );
    }

    let noneFound;

    if (!documents.length) {
        noneFound = found_count === 0 ? <NoneFoundBox noun="files" /> : <LoadingPlaceholder />;
    }

    const title = `${fileType === "reads" ? "Read" : capitalize(fileType)} Files`;

    return (
        <>
            <ViewHeader title={title} />
            <ViewHeaderTitle>
                {title} <Badge>{total_count}</Badge>
            </ViewHeaderTitle>
            {toolbar}
            {noneFound}

            <Pagination
                documents={documents}
                renderRow={renderRow}
                currentPage={page}
                pageCount={page_count}
                onLoadNextPage={pageNumber => onLoadNextPage(fileType, toString(pageNumber), pageNumber)}
            />
        </>
    );
};

export const mapStateToProps = (state, ownProps) => {
    const { found_count, page, page_count, total_count, per_page } = state.files;
    const documents = getFilteredFileIds(state);
    const storedFileType = state.files.fileType;

    return {
        found_count,
        per_page,
        page,
        page_count,
        total_count,
        canUpload: checkAdminOrPermission(state, "upload_file"),
        documents,
        storedFileType,
        urlPage: new URLSearchParams(state.router?.location.search).get("page") || 1,
        stale: state.files.stale,
        loading: documents === null || (storedFileType && ownProps?.fileType !== storedFileType)
    };
};

export const mapDispatchToProps = dispatch => ({
    onDrop: (fileType, acceptedFiles) => {
        forEach(acceptedFiles, file => {
            const localId = createRandomString();
            dispatch(upload(localId, file, fileType));
        });
    },

    onLoadNextPage: (fileType, term, page = 1) => {
        dispatch(findFiles(fileType, term, page || 1));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(FileManager);
