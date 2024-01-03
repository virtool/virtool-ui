import { get } from "lodash-es";
import numbro from "numbro";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { checkAdminRoleOrPermission } from "../../../administration/utils";
import { pushState } from "../../../app/actions";
import { Icon, LoadingPlaceholder, NotFound, Table, ViewHeader, ViewHeaderIcons, ViewHeaderTitle } from "../../../base";
import { Permission } from "../../../groups/types";
import { getSubtraction } from "../../actions";
import { SubtractionAttribution } from "../Attribution";
import EditSubtraction from "../Edit";
import RemoveSubtraction from "../Remove";
import SubtractionFiles from "./Files";

function calculateGc(nucleotides) {
    return numbro(1 - nucleotides.a - nucleotides.t - nucleotides.n).format("0.000");
}

export function SubtractionDetail({ error, canModify, detail, onGet, onShowRemove, match }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        onGet(match.params.subtractionId);
    }, []);

    const handleHide = () => {
        setShow(false);
    };

    if (error) {
        return <NotFound />;
    }

    if (detail === null) {
        return <LoadingPlaceholder />;
    }

    if (!detail.ready) {
        return <LoadingPlaceholder message="Subtraction is still being imported" />;
    }
    return (
        <>
            <ViewHeader title={detail.name}>
                <ViewHeaderTitle>
                    {detail.name}
                    {canModify && (
                        <ViewHeaderIcons>
                            <Icon name="pencil-alt" color="orange" onClick={() => setShow(true)} />
                            <Icon name="trash" color="red" onClick={onShowRemove} />
                        </ViewHeaderIcons>
                    )}
                </ViewHeaderTitle>
                {detail.user ? <SubtractionAttribution handle={detail.user.handle} time={detail.created_at} /> : null}
            </ViewHeader>
            <Table>
                <tbody>
                    <tr>
                        <th>Nickname</th>
                        <td>{detail.nickname}</td>
                    </tr>
                    <tr>
                        <th>File</th>
                        <td>{detail.file.name || detail.file.id}</td>
                    </tr>
                    <tr>
                        <th>Sequence Count</th>
                        <td>{detail.count}</td>
                    </tr>
                    <tr>
                        <th>GC Estimate</th>
                        <td>{calculateGc(detail.gc)}</td>
                    </tr>
                    <tr>
                        <th>Linked Samples</th>
                        <td>{detail.linked_samples.length}</td>
                    </tr>
                </tbody>
            </Table>
            <SubtractionFiles />
            <EditSubtraction show={show} onHide={handleHide} />
            <RemoveSubtraction />
        </>
    );
}

const mapStateToProps = state => ({
    error: get(state, "errors.GET_SUBTRACTION_ERROR"),
    canModify: checkAdminRoleOrPermission(state, Permission.modify_subtraction),
    detail: state.subtraction.detail,
});

const mapDispatchToProps = dispatch => ({
    onGet: subtractionId => {
        dispatch(getSubtraction(subtractionId));
    },

    onShowRemove: () => {
        dispatch(pushState({ removeSubtraction: true }));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SubtractionDetail);
