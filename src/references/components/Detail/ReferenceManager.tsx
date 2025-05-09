import { usePathParams } from "@app/hooks";
import { cn } from "@app/utils";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupTable from "@base/BoxGroupTable";
import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import React from "react";
import Contributors from "../../../indexes/components/Contributors";
import { useGetReference } from "../../queries";
import { Clone } from "./Clone";
import { LatestBuild } from "./LatestBuild";
import RemoteReference from "./Remote";

/**
 * Display and edit information for a reference
 */
export default function ReferenceManager() {
    const { refId } = usePathParams<{ refId: string }>();
    const { data: reference, isPending } = useGetReference(refId);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const {
        cloned_from,
        contributors,
        description,
        latest_build,
        organism,
        remotes_from,
    } = reference;

    return (
        <ContainerNarrow>
            <BoxGroup>
                <BoxGroupHeader>
                    <h2>General</h2>
                </BoxGroupHeader>
                <BoxGroupTable
                    className={cn(
                        "[&_th]:w-45",
                        "[&_tr:not(:first-of-type)_td]:capitalize",
                    )}
                >
                    <tbody>
                        <tr>
                            <th>Description</th>
                            <td>{description}</td>
                        </tr>
                        <tr>
                            <th>Organism</th>
                            <td>{organism}</td>
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
        </ContainerNarrow>
    );
}
