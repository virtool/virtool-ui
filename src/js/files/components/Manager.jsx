import { capitalize, min, toString } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Badge, LoadingPlaceholder, NoneFoundBox, Pagination, ViewHeader, ViewHeaderTitle } from "../../base";
import { findFiles } from "../actions";
import { getFilteredFileIds } from "../selectors";
import File from "./File";
import UploadToolbar from "./Toolbar";

const renderRow = item => <File key={item} id={item} />;

export const FileManager = ({
    onLoadNextPage,
    items,
    validationRegex,
    message,
    total_count,
    page,
    tip,
    fileType,
    page_count,
    URLPage,
    loading,
    found_count
}) => {
    useEffect(() => {
        onLoadNextPage(fileType, "", min([URLPage, page_count]));
    }, []);

    if (loading) {
        return <LoadingPlaceholder />;
    }

    const noneFound = found_count === 0 && <NoneFoundBox noun="files" />;

    const title = `${fileType === "reads" ? "Read" : capitalize(fileType)} Files`;

    return (
        <>
            <ViewHeader title={title} />
            <ViewHeaderTitle>
                {title} <Badge>{total_count}</Badge>
            </ViewHeaderTitle>
            <UploadToolbar fileType={fileType} message={message} validationRegex={validationRegex} tip={tip} />
            {noneFound}

            <Pagination
                items={items}
                renderRow={renderRow}
                storedPage={page}
                currentPage={URLPage}
                pageCount={page_count}
                onLoadNextPage={pageNumber => onLoadNextPage(fileType, toString(pageNumber), pageNumber)}
            />
        </>
    );
};

export const mapStateToProps = (state, ownProps) => {
    const { found_count, page, page_count, total_count, per_page, fileType } = state.files;
    const items = getFilteredFileIds(state);
    return {
        found_count,
        per_page,
        page,
        page_count,
        total_count,
        items,
        URLPage: parseInt(new URLSearchParams(state.router?.location.search).get("page")) || 1,
        stale: state.files.stale,
        loading: items === null || (fileType && ownProps?.fileType !== fileType)
    };
};

export const mapDispatchToProps = dispatch => ({
    onLoadNextPage: (fileType, term, page) => {
        dispatch(findFiles(fileType, term, true, page));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(FileManager);
