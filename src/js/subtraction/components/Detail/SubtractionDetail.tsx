import numbro from "numbro";
import React, { useState } from "react";
import { connect } from "react-redux";
import { checkAdminRoleOrPermission } from "../../../administration/utils";
import { pushState } from "../../../app/actions";
import { Icon, LoadingPlaceholder, NotFound, Table, ViewHeader, ViewHeaderIcons, ViewHeaderTitle } from "../../../base";
import { Permission } from "../../../groups/types";
import { useFetchSubtraction } from "../../querys";
import { SubtractionAttribution } from "../Attribution";
import EditSubtraction from "../Edit";
import RemoveSubtraction from "../Remove";
import SubtractionFiles from "./Files";

function calculateGc(nucleotides) {
    return numbro(1 - nucleotides.a - nucleotides.t - nucleotides.n).format("0.000");
}

export function SubtractionDetail({ canModify, onShowRemove, match }) {
    const [show, setShow] = useState(false);
    const { data, isLoading, isError } = useFetchSubtraction(match.params.subtractionId);

    if (isError) {
        return <NotFound />;
    }

    if (isLoading) {
        return <LoadingPlaceholder />;
    }
    console.log(data);

    const handleHide = () => {
        setShow(false);
    };

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
                            <Icon name="pencil-alt" color="orange" onClick={() => setShow(true)} />
                            <Icon name="trash" color="red" onClick={onShowRemove} />
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
            <EditSubtraction show={show} onHide={handleHide} />
            <RemoveSubtraction subtraction={data} />
        </>
    );
}

const mapStateToProps = state => ({
    canModify: checkAdminRoleOrPermission(state, Permission.modify_subtraction),
});

const mapDispatchToProps = dispatch => ({
    onShowRemove: () => {
        dispatch(pushState({ removeSubtraction: true }));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SubtractionDetail);
