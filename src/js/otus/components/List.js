import React, { useEffect } from "react";
import { connect } from "react-redux";
import { pushState } from "../../app/actions";
import { LoadingPlaceholder, NarrowContainer, NoneFoundBox, ScrollList } from "../../base";
import RebuildAlert from "../../indexes/components/RebuildAlert";
import { findOTUs } from "../actions";
import { getTerm } from "../selectors";
import CreateOTU from "./Create";
import OTUItem from "./Item";
import OTUToolbar from "./Toolbar";

export const OTUsList = props => {
    useEffect(() => {
        props.onLoadNextPage(props.refId, props.term, props.verified, 1);
    }, []);

    const renderRow = index => <OTUItem key={index} index={index} />;

    if (props.documents === null) {
        return <LoadingPlaceholder />;
    }

    let noneFound;

    if (!props.documents.length) {
        noneFound = <NoneFoundBox noun="OTUs" />;
    }

    return (
        <NarrowContainer>
            <RebuildAlert />
            <OTUToolbar />
            <CreateOTU {...props} />

            {noneFound}

            <ScrollList
                documents={props.documents}
                onLoadNextPage={page => props.onLoadNextPage(props.refId, props.term, props.verified, page)}
                page={props.page}
                pageCount={props.page_count}
                renderRow={renderRow}
            />
        </NarrowContainer>
    );
};

export const mapStateToProps = state => ({
    ...state.otus,
    term: getTerm(state),
    refId: state.references.detail.id,
    verified: state.otus.verified
});

export const mapDispatchToProps = dispatch => ({
    onHide: () => {
        dispatch(pushState({ createOTU: false }));
    },

    onLoadNextPage: (refId, term, verified, page) => {
        dispatch(findOTUs(refId, term, verified, page));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(OTUsList);
