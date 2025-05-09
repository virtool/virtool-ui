import { usePathParams } from "@app/hooks";
import { cn } from "@app/utils";
import Link from "@base/Link";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NotFound from "@base/NotFound";
import Tabs from "@base/Tabs";
import TabsLink from "@base/TabsLink";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderIcons from "@base/ViewHeaderIcons";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import React from "react";
import styled from "styled-components";
import { Redirect, Route, Switch } from "wouter";
import { useGetReference } from "../../../references/queries";
import { useFetchOTU } from "../../queries";
import History from "./History/OtuHistory";
import { OtuHeaderIcons } from "./OtuHeaderIcons";
import OtuSection from "./OtuSection";
import Schema from "./Schema/Schema";

const OTUDetailTitle = styled(ViewHeaderTitle)`
    align-items: baseline;
    display: flex;

    small {
        color: ${(props) => props.theme.color.greyDark};
        font-weight: 600;
        margin-left: 7px;

        em {
            font-weight: normal;
        }
    }
`;

/**
 * Displays the details of an OTU.
 */
export default function OtuDetail() {
    const { otuId, refId } = usePathParams<{ otuId: string; refId: string }>();
    const { data: otu, isPending: isPendingOtu, isError } = useFetchOTU(otuId);
    const { data: reference, isPending: isPendingReference } =
        useGetReference(refId);

    if (isError) {
        return <NotFound />;
    }

    if (isPendingOtu || isPendingReference) {
        return <LoadingPlaceholder />;
    }

    const { id, name, abbreviation } = otu;

    return (
        <>
            <ViewHeader title={name}>
                <OTUDetailTitle>
                    {name}{" "}
                    <small>{abbreviation || <em>No Abbreviation</em>}</small>
                    <ViewHeaderIcons>
                        <a href={`/api/otus/${id}.fa`} download>
                            Download FASTA
                        </a>
                        <OtuHeaderIcons
                            id={id}
                            refId={refId}
                            name={name}
                            abbreviation={abbreviation}
                        />
                    </ViewHeaderIcons>
                </OTUDetailTitle>
                <p
                    className={cn(
                        "flex",
                        "font-medium",
                        "items-center",
                        "gap-2",
                        "py-2",
                        "text-lg",
                    )}
                >
                    <Link to={`/refs/${refId}`}>{reference.name}</Link>
                    <span className="text-slate-600">/</span>
                    <Link to={`/refs/${refId}/otus`}>OTUs</Link>
                    <span className="text-slate-600">/</span>
                    <Link to={`/refs/${refId}/otus/${otuId}`}>{name}</Link>
                </p>
            </ViewHeader>

            <Tabs>
                <TabsLink to={`/refs/${refId}/otus/${otuId}/otu`}>OTU</TabsLink>
                <TabsLink to={`/refs/${refId}/otus/${otuId}/schema`}>
                    Schema
                </TabsLink>
                <TabsLink to={`/refs/${refId}/otus/${otuId}/history`}>
                    History
                </TabsLink>
            </Tabs>

            <Switch>
                <Route
                    path="/refs/:refId/otus/:otuId/"
                    component={() => (
                        <Redirect
                            to={`/refs/${refId}/otus/${otuId}/otu`}
                            replace
                        />
                    )}
                />
                <Route
                    path="/refs/:refId/otus/:otuId/otu"
                    component={OtuSection}
                />
                <Route
                    path="/refs/:refId/otus/:otuId/history"
                    component={History}
                />
                <Route
                    path="/refs/:refId/otus/:otuId/schema"
                    component={Schema}
                />
            </Switch>
        </>
    );
}
