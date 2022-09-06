import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Badge, LoadingPlaceholder, NarrowContainer, ScrollList, ViewHeader, ViewHeaderTitle } from "../../base";
import { findReferences, remoteReference } from "../actions";
import { getTerm } from "../selectors";
import Clone from "./Clone";
import ReferenceItem from "./Item/Item";
import ReferenceOfficial from "./Official";
import ReferenceToolbar from "./Toolbar";

const ReferenceList = ({ term, documents, total_count, onLoadNextPage, page, pageCount }) => {
    useEffect(() => {
        onLoadNextPage(term, 1);
    }, []);

    const renderRow = index => <ReferenceItem key={documents[index].id} index={index} />;

    if (documents === null) {
        return <LoadingPlaceholder />;
    }

    return (
        <>
            <NarrowContainer>
                <ViewHeader title="References">
                    <ViewHeaderTitle>
                        References <Badge>{total_count}</Badge>
                    </ViewHeaderTitle>
                </ViewHeader>

                <ReferenceToolbar />
                <ReferenceOfficial />

                <ScrollList
                    documents={documents}
                    onLoadNextPage={page => onLoadNextPage(term, page)}
                    page={page}
                    pageCount={pageCount}
                    renderRow={renderRow}
                />
            </NarrowContainer>
            <Clone />
        </>
    );
};

const mapStateToProps = state => ({
    documents: state.references.documents,
    total_count: state.references.total_count,
    page: state.references.page,
    pageCount: state.references.pageCount,
    term: getTerm(state)
});

const mapDispatchToProps = dispatch => ({
    onRemote: () => {
        dispatch(remoteReference());
    },
    onLoadNextPage: (term, page) => {
        dispatch(findReferences(term, page));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ReferenceList);
