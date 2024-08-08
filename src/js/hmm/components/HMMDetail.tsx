import { map } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { getBorder } from "../../app/theme";

import { BoxGroupHeaderBadge } from "@base/BoxGroupHeaderBadge";
import { match } from "react-router-dom";
import {
    BoxGroup,
    BoxGroupHeader,
    device,
    Label,
    LoadingPlaceholder,
    NotFound,
    Table,
    ViewHeader,
    ViewHeaderTitle,
} from "../../base";
import { useFetchHmm } from "../queries";
import { ClusterMember } from "./ClusterMember";
import { HMMTaxonomy } from "./HMMTaxonomy";

const ClusterTable = styled(Table)`
    border: none;
    display: flex;
    flex-flow: column;
    height: 330px !important;
    margin: 0;
    width: 100%;

    thead {
        flex: 0 0 auto;
        width: calc(100% - 0.9em);

        th {
            border-bottom: none;
        }
    }

    tbody {
        flex: 1 1 auto;
        display: block;
        overflow-y: auto;
        border-top: ${getBorder};

        tr {
            width: 100%;
        }

        tr:first-child td {
            border-top: none;
        }
    }

    thead,
    tbody tr {
        display: table;
        table-layout: fixed;
    }
`;

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
        return <LoadingPlaceholder className="mt-32" />;
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

                <Table>
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
                </Table>
            </BoxGroup>

            <BoxGroup>
                <BoxGroupHeader>
                    <h2>
                        Cluster Members <BoxGroupHeaderBadge>{data.entries.length}</BoxGroupHeaderBadge>
                    </h2>
                </BoxGroupHeader>
                <ClusterTable>
                    <thead>
                        <tr>
                            <th>Accession</th>
                            <th>Name</th>
                            <th>Organism</th>
                        </tr>
                    </thead>
                    <tbody>{clusterMembers}</tbody>
                </ClusterTable>
            </BoxGroup>

            <TaxonomyGrid>
                <HMMTaxonomy title="Families" counts={data.families} />
                <HMMTaxonomy title="Genera" counts={data.genera} />
            </TaxonomyGrid>
        </div>
    );
}
