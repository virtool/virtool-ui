import { cn } from "@/utils/utils";
import { map } from "lodash-es";
import React from "react";
import { match } from "react-router-dom";
import styled from "styled-components";
import {
    Badge,
    BoxGroup,
    BoxGroupHeader,
    BoxGroupTable,
    device,
    Label,
    LoadingPlaceholder,
    NotFound,
    ViewHeader,
    ViewHeaderTitle,
} from "../../base";
import { useFetchHmm } from "../queries";
import { ClusterMember } from "./ClusterMember";
import { HMMTaxonomy } from "./HMMTaxonomy";

const TaxonomyGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: ${props => props.theme.gap.column};

    @media (max-width: ${device.tablet}) {
        grid-template-columns: 1fr;
    }
`;

type HMMDetailProps = {
    /** Match object containing path information */
    match: match<string>;
};

/**
 * The HMM detailed view
 */
export default function HMMDetail({ match }: HMMDetailProps) {
    const { data, isLoading, isError } = useFetchHmm(match.params["hmmId"]);

    if (isError) {
        return <NotFound />;
    }

    if (isLoading) {
        return <LoadingPlaceholder margin="130px" />;
    }

    const clusterMembers = map(data.entries, ({ name, accession, organism }, index) => (
        <ClusterMember name={name} accession={accession} organism={organism} key={index} index={index} />
    ));

    const names = map(data.names, (name, index) => (
        <Label className="mr-1" key={index}>
            {name}
        </Label>
    ));

    const title = data.names[0];

    return (
        <div>
            <ViewHeader title={title}>
                <ViewHeaderTitle>{title}</ViewHeaderTitle>
            </ViewHeader>

            <BoxGroup>
                <BoxGroupHeader>
                    <h2>General</h2>
                </BoxGroupHeader>

                <BoxGroupTable>
                    <tbody>
                        <tr>
                            <th>Cluster</th>
                            <td>{data.cluster}</td>
                        </tr>

                        <tr>
                            <th>Best Definitions</th>
                            <td>{names}</td>
                        </tr>

                        <tr>
                            <th>Length</th>
                            <td>{data.length}</td>
                        </tr>

                        <tr>
                            <th>Mean Entropy</th>
                            <td>{data.mean_entropy}</td>
                        </tr>

                        <tr>
                            <th>Total Entropy</th>
                            <td>{data.total_entropy}</td>
                        </tr>
                    </tbody>
                </BoxGroupTable>
            </BoxGroup>

            <BoxGroup>
                <BoxGroupHeader>
                    <h2>
                        Cluster Members <Badge>{data.entries.length}</Badge>
                    </h2>
                </BoxGroupHeader>
                <BoxGroupTable
                    className={cn(
                        "border-none",
                        "flex",
                        "flex-col",
                        "h-82.5",
                        "m-0",
                        "w-full",
                        "[&_thead]:flex-none",
                        "[&_thead]:w-[calc(100%-0.9em)]",
                        "[&_thead_th]:border-b-0",
                        "[&_tbody]:flex-auto",
                        "[&_tbody]:block",
                        "[&_tbody]:overflow-y-auto",
                        "[&_tbody]:border-t",
                        "[&_tbody_tr]:w-full",
                        "[&_tbody_tr:first-child_td]:border-t-0",
                        "[&_thead,&_tbody_tr]:table",
                        "[&_thead,&_tbody_tr]:table-fixed"
                    )}
                >
                    <thead>
                        <tr>
                            <th>Accession</th>
                            <th>Name</th>
                            <th>Organism</th>
                        </tr>
                    </thead>
                    <tbody>{clusterMembers}</tbody>
                </BoxGroupTable>
            </BoxGroup>

            <TaxonomyGrid>
                <HMMTaxonomy title="Families" counts={data.families} />
                <HMMTaxonomy title="Genera" counts={data.genera} />
            </TaxonomyGrid>
        </div>
    );
}
