import { get } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Link, Redirect, Route, Switch, useHistory } from "react-router-dom";
import styled from "styled-components";
import { getFontWeight } from "../../../app/theme";
import {
    Icon,
    LoadingPlaceholder,
    NotFound,
    Tabs,
    TabsLink,
    ViewHeader,
    ViewHeaderIcons,
    ViewHeaderTitle,
} from "../../../base";
import { useGetReference } from "../../../references/querys";
import { getCanModifyReferenceOTU } from "../../../references/selectors";
import { getOTU, showEditOTU, showRemoveOTU } from "../../actions";
import EditOTU from "./Edit";
import IsolateEditor from "./Editor";
import General from "./General";
import History from "./History/History";
import AddIsolate from "./Isolates/AddIsolate";
import RemoveOTU from "./Remove";
import Schema from "./Schema/Schema";

function OTUSection({ match }) {
    const history = useHistory();
    const { otuId, refId } = match.params;
    const { data, isLoading } = useGetReference(refId);

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    return (
        <div>
            <General />
            <IsolateEditor />
            <AddIsolate
                allowedSourceTypes={data.source_types}
                otuId={otuId}
                restrictSourceTypes={data.restrict_source_types}
                show={history.location.state?.addIsolate}
                onHide={() => history.replace({ state: { addIsolate: false } })}
            />
        </div>
    );
}

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

class OTUDetail extends React.Component {
    componentDidMount() {
        this.props.getOTU(this.props.match.params.otuId);
    }

    render = () => {
        if (this.props.error) {
            return <NotFound />;
        }

        if (this.props.detail === null || this.props.detail.id !== this.props.match.params.otuId) {
            return <LoadingPlaceholder />;
        }

        const refId = this.props.detail.reference.id;
        const { id, name, abbreviation } = this.props.detail;

        let modifyOTUComponents;

        let segmentComponent;
        if (this.props.dataType !== "barcode") {
            segmentComponent = <TabsLink to={`/refs/${refId}/otus/${id}/schema`}>Schema</TabsLink>;
        }

        let iconButtons;

        if (this.props.canModify) {
            iconButtons = (
                <>
                    <Icon
                        key="edit-icon"
                        color="orange"
                        name="pencil-alt"
                        tip="Edit OTU"
                        tipPlacement="left"
                        onClick={this.props.showEdit}
                    />
                    <Icon
                        key="remove-icon"
                        color="red"
                        name="trash"
                        tip="Remove OTU"
                        tipPlacement="left"
                        onClick={this.props.showRemove}
                    />
                </>
            );

            modifyOTUComponents = (
                <div>
                    <EditOTU otuId={id} name={name} abbreviation={abbreviation} />
                    <RemoveOTU id={id} name={name} history={this.props.history} />
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
                        <Link to={`/refs/${this.props.detail.reference.id}`}>{this.props.refName}</Link>
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
    };
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
