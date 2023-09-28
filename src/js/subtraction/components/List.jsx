import React, { useEffect } from "react";
import { connect } from "react-redux";
import { checkAdminRoleOrPermission } from "../../administration/utils";
import { Badge, LegacyScrollList, LoadingPlaceholder, NoneFoundBox, ViewHeader, ViewHeaderTitle } from "../../base";
import { useUrlSearchParams } from "../../utils/hooks";
import { findSubtractions } from "../actions";
import SubtractionItem from "./Item";
import SubtractionToolbar from "./Toolbar";

const renderRow = index => <SubtractionItem key={index} index={index} />;

export function SubtractionList({ onLoadNextPage, documents, page, page_count, total_count, fetched }) {
    const { value: term } = useUrlSearchParams({
        key: "find",
    });
    useEffect(() => {
        if (!fetched) {
            onLoadNextPage(term, 1);
        }
    }, [fetched, onLoadNextPage, term]);
    if (documents === null) {
        return <LoadingPlaceholder />;
    }

    const subtractionComponents = documents.length ? (
        <LegacyScrollList
            documents={documents}
            onLoadNextPage={page => onLoadNextPage(term, page)}
            page={page}
            pageCount={page_count}
            renderRow={renderRow}
        />
    ) : (
        <NoneFoundBox noun="subtractions" />
    );

    return (
        <>
            <ViewHeader title="Subtractions">
                <ViewHeaderTitle>
                    Subtractions <Badge>{total_count}</Badge>
                </ViewHeaderTitle>
            </ViewHeader>

            <SubtractionToolbar />

            {subtractionComponents}
        </>
    );
}

const mapStateToProps = state => ({
    fetched: state.subtraction.fetched,
    documents: state.subtraction.documents,
    page: state.subtraction.page,
    page_count: state.subtraction.page_count,
    total_count: state.subtraction.total_count,
    canModify: checkAdminRoleOrPermission(state, "modify_subtraction"),
});

const mapDispatchToProps = dispatch => ({
    onLoadNextPage: (term, page) => {
        dispatch(findSubtractions(term, page));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SubtractionList);
