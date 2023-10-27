import React, { useEffect } from "react";
import { connect } from "react-redux";
import { checkAdminRoleOrPermission } from "../../administration/utils";
import { Badge, LegacyScrollList, LoadingPlaceholder, NoneFoundBox, ViewHeader, ViewHeaderTitle } from "../../base";
import { useUrlSearchParams } from "../../utils/hooks";
import { findSubtractions } from "../actions";
import SubtractionItem from "./Item";
import SubtractionToolbar from "./Toolbar";

const renderRow = index => <SubtractionItem key={index} index={index} />;

/**
 * Display and filter a list of subtractions
 *
 * @param onLoadNextPage - Function to load the next page of subtraction operations
 * @param documents - List of subtraction documents to display
 * @param page - The current page of list
 * @param page_count - The total number of pages
 * @param total_count - The total number of subtractions
 * @param fetched - Indicates whether subtraction data has been fetched
 * @returns SubtractionList - A list of subtractions
 */
export function SubtractionList({ onLoadNextPage, documents, page, page_count, total_count, fetched }) {
    const [term] = useUrlSearchParams("find", "foo");
    useEffect(() => {
        if (!fetched) {
            onLoadNextPage(term, 1);
        }
    }, [term]);
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
