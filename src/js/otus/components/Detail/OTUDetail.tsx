import { get } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { getFontWeight } from "../../../app/theme";
import {
    Icon,
    IconLink,
    LoadingPlaceholder,
    NotFound,
    Tabs,
    TabsLink,
    ViewHeader,
    ViewHeaderIcons,
    ViewHeaderTitle,
} from "../../../base";
import { getCanModifyReferenceOTU } from "../../../references/selectors";
import { getOTU, showEditOTU, showRemoveOTU } from "../../actions";
import EditOTU from "./EditOTU";
import History from "./History/History";
import OTUSection from "./OTUSection";
import RemoveOTU from "./RemoveOTU";
import Schema from "./Schema/Schema";

const OTUDetailTitle = styled(ViewHeaderTitle)`
    align-items: baseline;
    display: flex;

    small {
        color: ${props => props.theme.color.greyDark};
        font-weight: 600;
        margin-left: 7px;

        em {
            font-weight: normal;
        }
    }
`;

const OTUDetailSubtitle = styled.p`
    font-size: ${props => props.theme.fontSize.md};
    margin-top: 5px;

    strong {
        font-weight: ${getFontWeight("thick")};
    }
`;

export function OTUDetail(props) {
    useEffect(() => {
        props.getOTU(props.match.params.otuId);
    }, []);

    if (props.error) {
        return <NotFound />;
    }

    if (props.detail === null || props.detail.id !== props.match.params.otuId) {
        return <LoadingPlaceholder />;
    }

    const refId = props.detail.reference.id;
    const { id, name, abbreviation } = props.detail;

    let modifyOTUComponents;

    let segmentComponent;
    if (props.dataType !== "barcode") {
        segmentComponent = <TabsLink to={`/refs/${refId}/otus/${id}/schema`}>Schema</TabsLink>;
    }

    let iconButtons;

    if (props.canModify) {
        iconButtons = (
            <>
                <Icon
                    key="edit-icon"
                    color="orange"
                    name="pencil-alt"
                    tip="Edit OTU"
                    tipPlacement="left"
                    onClick={props.showEdit}
                />
                <IconLink
                    key="remove-icon"
                    color="red"
                    name="trash"
                    tip="Remove OTU"
                    to={{ state: { removeOTU: true } }}
                />
            </>
        );

        modifyOTUComponents = (
            <div>
                <EditOTU otuId={id} name={name} abbreviation={abbreviation} />
                <RemoveOTU id={id} name={name} refId={refId} />
            </div>
        );
    }

    return (
        <>
            <ViewHeader title={name}>
                <OTUDetailTitle>
                    {name} <small>{abbreviation || <em>No Abbreviation</em>}</small>
                    <ViewHeaderIcons>
                        <a href={`/api/otus/${id}.fa`} download>
                            Download FASTA
                        </a>
                        {iconButtons}
                    </ViewHeaderIcons>
                </OTUDetailTitle>
                <OTUDetailSubtitle>
                    <strong>From Reference / </strong>
                    <Link to={`/refs/${props.detail.reference.id}`}>{props.refName}</Link>
                </OTUDetailSubtitle>
            </ViewHeader>

            <Tabs>
                <TabsLink to={`/refs/${refId}/otus/${id}/otu`}>OTU</TabsLink>
                {segmentComponent}
                <TabsLink to={`/refs/${refId}/otus/${id}/history`}>History</TabsLink>
            </Tabs>

            {modifyOTUComponents}

            <Switch>
                <Redirect from="/refs/:refId/otus/:otuId" to={`/refs/${refId}/otus/${id}/otu`} exact />
                <Route path="/refs/:refId/otus/:otuId/otu" component={OTUSection} />
                <Route path="/refs/:refId/otus/:otuId/history" component={History} />
                <Route path="/refs/:refId/otus/:otuId/schema" component={Schema} />
            </Switch>
        </>
    );
}

const mapStateToProps = state => {
    return {
        error: get(state, "errors.GET_OTU_ERROR", null),
        detail: state.otus.detail,
        refName: state.references.detail.name,
        canModify: getCanModifyReferenceOTU(state),
        dataType: state.references.detail.data_type,
    };
};

const mapDispatchToProps = dispatch => ({
    getOTU: otuId => {
        dispatch(getOTU(otuId));
    },

    showEdit: () => {
        dispatch(showEditOTU());
    },

    showRemove: () => {
        dispatch(showRemoveOTU());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OTUDetail);
