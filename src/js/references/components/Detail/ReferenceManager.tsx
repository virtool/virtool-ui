import React from "react";
import { match } from "react-router-dom";
import styled from "styled-components";
import { BoxGroup, BoxGroupHeader, ContainerNarrow, LoadingPlaceholder, Table } from "../../../base";
import Contributors from "../../../indexes/components/Contributors";
import { useGetReference } from "../../queries";
import { Clone } from "./Clone";
import { LatestBuild } from "./LatestBuild";
import RemoteReference from "./Remote";
import Targets from "./Targets/Targets";

const ReferenceManageTable = styled(Table)`
    th {
        width: 180px;
    }

    tr:not(:first-of-type) td {
        text-transform: capitalize;
    }
`;

type ReferenceManageProps = {
    /** Match object containing path information */
    match: match<{ refId: string }>;
};

/**
 * Display and edit information for a reference
 */
export default function ReferenceManager({ match }: ReferenceManageProps) {
    const { refId } = match.params;
    const { data: reference, isLoading } = useGetReference(refId);

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const { cloned_from, contributors, data_type, description, latest_build, organism, remotes_from } = reference;

    return (
        <ContainerNarrow>
            <BoxGroup>
                <BoxGroupHeader>
                    <h2>General</h2>
                </BoxGroupHeader>
                <ReferenceManageTable>
                    <tbody>
                        <tr>
                            <th>Description</th>
                            <td>{description}</td>
                        </tr>
                        <tr>
                            <th>Organism</th>
                            <td>{organism}</td>
                        </tr>
                        <tr>
                            <th>Data Type</th>
                            <td>{data_type}</td>
                        </tr>
                    </tbody>
                </ReferenceManageTable>
            </BoxGroup>

            {remotes_from && <RemoteReference detail={reference} />}
            {cloned_from && <Clone source={cloned_from} />}

            <BoxGroup>
                <BoxGroupHeader>
                    <h2>Latest Index Build</h2>
                </BoxGroupHeader>
                <LatestBuild id={refId} latestBuild={latest_build} />
            </BoxGroup>

            <Contributors contributors={contributors} />
            <Targets reference={reference} />
        </ContainerNarrow>
    );
}
