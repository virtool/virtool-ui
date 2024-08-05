import { IconButton } from "@base/IconButton";
import numbro from "numbro";
import React, { useState } from "react";
import { match, useHistory } from "react-router-dom";
import { useCheckAdminRoleOrPermission } from "../../../administration/hooks";
import { LoadingPlaceholder, NotFound, Table, ViewHeader, ViewHeaderIcons, ViewHeaderTitle } from "../../../base";
import { Permission } from "../../../groups/types";
import { useFetchSubtraction } from "../../queries";
import { NucleotideComposition } from "../../types";
import { SubtractionAttribution } from "../Attribution";
import EditSubtraction from "./EditSubtraction";
import SubtractionFiles from "./Files";
import RemoveSubtraction from "./RemoveSubtraction";

function calculateGc(nucleotides: NucleotideComposition) {
    return numbro(1 - nucleotides.a - nucleotides.t - nucleotides.n).format("0.000");
}

type SubtractionDetailProps = {
    /** Match object containing path information */
    match: match<{ subtractionId: string }>;
};

/**
 * The subtraction detailed view
 */
export default function SubtractionDetail({ match }: SubtractionDetailProps) {
    const history = useHistory<{ removeSubtraction: boolean }>();
    const [show, setShow] = useState(false);
    const { data, isLoading, isError } = useFetchSubtraction(match.params.subtractionId);
    const { hasPermission: canModify } = useCheckAdminRoleOrPermission(Permission.modify_subtraction);

    if (isError) {
        return <NotFound />;
    }

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    if (!data.ready) {
        return <LoadingPlaceholder message="Subtraction is still being imported" />;
    }

    return (
        <>
            <ViewHeader title={data.name}>
                <ViewHeaderTitle>
                    {data.name}
                    {canModify && (
                        <ViewHeaderIcons>
                            <IconButton name="pen" color="grayDark" tip="modify" onClick={() => setShow(true)} />
                            <IconButton
                                name="trash"
                                color="red"
                                tip="remove"
                                onClick={() => history.push({ state: { removeSubtraction: true } })}
                            />
                        </ViewHeaderIcons>
                    )}
                </ViewHeaderTitle>
                {data.user ? <SubtractionAttribution handle={data.user.handle} time={data.created_at} /> : null}
            </ViewHeader>
            <Table>
                <tbody>
                    <tr>
                        <th>Nickname</th>
                        <td>{data.nickname}</td>
                    </tr>
                    <tr>
                        <th>File</th>
                        <td>{data.file.name || data.file.id}</td>
                    </tr>
                    <tr>
                        <th>Sequence Count</th>
                        <td>{data.count}</td>
                    </tr>
                    <tr>
                        <th>GC Estimate</th>
                        <td>{calculateGc(data.gc)}</td>
                    </tr>
                    <tr>
                        <th>Linked Samples</th>
                        <td>{data.linked_samples.length}</td>
                    </tr>
                </tbody>
            </Table>
            <SubtractionFiles files={data.files} />
            <EditSubtraction show={show} onHide={() => setShow(false)} subtraction={data} />
            <RemoveSubtraction
                subtraction={data}
                show={history.location.state?.removeSubtraction}
                onHide={() => history.push({ state: { removeSubtraction: false } })}
            />
        </>
    );
}
