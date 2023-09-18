import React, { useEffect } from "react";
import { connect } from "react-redux";
import { checkAdminRoleOrPermission } from "../../administration/utils";
import { Badge, LegacyScrollList, LoadingPlaceholder, NoneFoundBox, ViewHeader, ViewHeaderTitle } from "../../base";
import { findSubtractions } from "../actions";
import SubtractionItem from "./Item";
import SubtractionToolbar from "./Toolbar";

export const SubtractionList = ({ onLoadNextPage, documents, page, page_count, total_count, fetched, term }) => {
    useEffect(() => {
        if (!fetched) {
            onLoadNextPage(term, 1);
        }
    }, []);

    const renderRow = index => <SubtractionItem key={index} index={index} />;
    let subtractionComponents;

    if (documents === null) {
        return <LoadingPlaceholder />;
    }

    if (documents.length) {
        subtractionComponents = (
            <LegacyScrollList
                documents={documents}
                onLoadNextPage={page => onLoadNextPage(term, page)}
                page={page}
                pageCount={page_count}
                renderRow={renderRow}
            />
        );
    } else {
        subtractionComponents = <NoneFoundBox noun="subtractions" />;
    }

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
};

const mapStateToProps = state => ({
    ...state.subtraction,
    fetched: state.subtraction.fetched,
    documents: state.subtraction.documents,
    page: state.subtraction.page,
    page_count: state.subtraction.page_count,
    total_count: state.subtraction.total_count,
    term: state.subtraction.term,
    canModify: checkAdminRoleOrPermission(state, "modify_subtraction"),
});

const mapDispatchToProps = dispatch => ({
    onLoadNextPage: (term, page) => {
        dispatch(findSubtractions(term, page));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SubtractionList);
