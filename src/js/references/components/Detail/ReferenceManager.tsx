import { cn } from "@/utils/utils";
import { BoxGroup, BoxGroupHeader, BoxGroupTable, ContainerNarrow, LoadingPlaceholder } from "@base";
import Contributors from "@indexes/components/Contributors";
import React from "react";
import { useGetReference } from "../../queries";
import { Clone } from "./Clone";
import { LatestBuild } from "./LatestBuild";
import RemoteReference from "./Remote";
import Targets from "./Targets/Targets";
import { usePathParams } from "@utils/hooks";

/**
 * Display and edit information for a reference
 */
export default function ReferenceManager() {
    const { refId } = usePathParams<{ refId: string }>();
    const { data: reference, isPending } = useGetReference(refId);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const { cloned_from, contributors, data_type, description, latest_build, organism, remotes_from } = reference;

    return (
        <ContainerNarrow>
            <BoxGroup>
                <BoxGroupHeader>
                    <h2>General</h2>
                </BoxGroupHeader>
                <BoxGroupTable className={cn("[&_th]:w-45", "[&_tr:not(:first-of-type)_td]:capitalize")}>
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
                </BoxGroupTable>
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
