import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Badge, ContainerNarrow, LegacyScrollList, LoadingPlaceholder, ViewHeader, ViewHeaderTitle } from "../../base";
import { findReferences, remoteReference } from "../actions";
import { getTerm } from "../selectors";
import Clone from "./Clone";
import ReferenceItem from "./Item/Item";
import ReferenceOfficial from "./Official";
import ReferenceToolbar from "./Toolbar";

const ReferenceList = ({ term, documents, totalCount, onLoadNextPage, page, pageCount }) => {
    useEffect(() => {
        onLoadNextPage(term, 1);
    }, []);

    const renderRow = index => <ReferenceItem key={documents[index].id} index={index} />;

    if (documents === null) {
        return <LoadingPlaceholder />;
    }

    return (
        <>
            <ContainerNarrow>
                <ViewHeader title="References">
                    <ViewHeaderTitle>
                        References <Badge>{totalCount}</Badge>
                    </ViewHeaderTitle>
                </ViewHeader>

                <ReferenceToolbar />
                <ReferenceOfficial />

                <LegacyScrollList
                    documents={documents}
                    onLoadNextPage={page => onLoadNextPage(term, page)}
                    page={page}
                    pageCount={pageCount}
                    renderRow={renderRow}
                />
            </ContainerNarrow>
            <Clone />
        </>
    );
};

const mapStateToProps = state => ({
    documents: state.references.documents,
    totalCount: state.references.total_count,
    page: state.references.page,
    pageCount: state.references.page_count,
    term: getTerm(state),
});

const mapDispatchToProps = dispatch => ({
    onRemote: () => {
        dispatch(remoteReference());
    },
    onLoadNextPage: (term, page) => {
        dispatch(findReferences(term, page));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ReferenceList);
