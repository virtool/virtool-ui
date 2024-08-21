import { getFontWeight } from "@app/theme";
import { LoadingPlaceholder, NotFound, Tabs, TabsLink, ViewHeader, ViewHeaderIcons, ViewHeaderTitle } from "@base";
import { useFetchOTU } from "@otus/queries";
import { useGetReference } from "@references/queries";
import React from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import styled from "styled-components";
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
export default function OTUDetail({ match }) {
    const { otuId, refId } = match.params;
    const { data: otu, isPending: isPendingOTU, isError } = useFetchOTU(otuId);
    const { data: reference, isPending: isPendingReference } = useGetReference(refId);

    if (isError) {
        return <NotFound />;
    }

    if (isPendingOTU || isPendingReference) {
        return <LoadingPlaceholder />;
    }

    const { id, name, abbreviation } = otu;

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
                    <Link to={`/refs/${refId}`}>{reference.name}</Link>
                </OTUDetailSubtitle>
            </ViewHeader>

            <Tabs>
                <TabsLink to={`/refs/${refId}/otus/${id}/otu`}>OTU</TabsLink>
                {reference.data_type !== "barcode" && (
                    <TabsLink to={`/refs/${refId}/otus/${id}/schema`}>Schema</TabsLink>
                )}
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
