import { get } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { getFontWeight } from "../../../app/theme";
import {
    LoadingPlaceholder,
    NotFound,
    Tabs,
    TabsLink,
    ViewHeader,
    ViewHeaderIcons,
    ViewHeaderTitle,
} from "../../../base";
import { getOTU } from "../../actions";
import History from "./History/OTUHistory";
import { OTUHeaderEndIcons } from "./OTUHeaderEndIcons";
import OTUSection from "./OTUSection";
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

/**
 * Displays detailed otu view allowing users to manage otus
 */
export function OTUDetail({ match, error, detail, refName, dataType, getOTU }) {
    useEffect(() => {
        getOTU(match.params.otuId);
    }, []);

    if (error) {
        return <NotFound />;
    }

    if (detail === null || detail.id !== match.params.otuId) {
        return <LoadingPlaceholder />;
    }

    const refId = detail.reference.id;
    const { id, name, abbreviation } = detail;

    return (
        <>
            <ViewHeader title={name}>
                <OTUDetailTitle>
                    {name} <small>{abbreviation || <em>No Abbreviation</em>}</small>
                    <ViewHeaderIcons>
                        <a href={`/api/otus/${id}.fa`} download>
                            Download FASTA
                        </a>
                        <OTUHeaderEndIcons id={id} refId={refId} name={name} abbreviation={abbreviation} />
                    </ViewHeaderIcons>
                </OTUDetailTitle>
                <OTUDetailSubtitle>
                    <strong>From Reference / </strong>
                    <Link to={`/refs/${detail.reference.id}`}>{refName}</Link>
                </OTUDetailSubtitle>
            </ViewHeader>

            <Tabs>
                <TabsLink to={`/refs/${refId}/otus/${id}/otu`}>OTU</TabsLink>
                {dataType !== "barcode" && <TabsLink to={`/refs/${refId}/otus/${id}/schema`}>Schema</TabsLink>}
                <TabsLink to={`/refs/${refId}/otus/${id}/history`}>History</TabsLink>
            </Tabs>

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
        dataType: state.references.detail.data_type,
    };
};

const mapDispatchToProps = dispatch => ({
    getOTU: otuId => {
        dispatch(getOTU(otuId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OTUDetail);
