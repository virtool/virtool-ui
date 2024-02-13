import { find, map, reject } from "lodash-es";
import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useCheckAdminRole } from "../../../../administration/hooks";
import { AdministratorRoles } from "../../../../administration/types";
import { BoxGroup, BoxGroupHeader, NoneFoundSection } from "../../../../base";
import { useUpdateReference } from "../../../hooks";
import { Reference } from "../../../types";
import AddTarget from "./Add";
import EditTarget from "./Edit";
import { TargetItem } from "./Item";

const TargetsHeader = styled(BoxGroupHeader)`
    h2 {
        display: flex;
        justify-content: space-between;
    }
`;

type TargetsProps = {
    /** The reference data */
    reference: Reference;
};

/**
 * Displays the targets with options to edit/remove
 */
export default function Targets({ reference }: TargetsProps) {
    const { data_type, targets, id, name } = reference;

    const history = useHistory();
    const location = useLocation<{ addTarget: boolean; editTarget: boolean }>();
    const { hasPermission: canModify } = useCheckAdminRole(AdministratorRoles.USERS);
    const { mutation } = useUpdateReference(id);

    if (data_type !== "barcode") {
        return null;
    }

    const targetComponents = map(targets, target => (
        <TargetItem
            key={target.name}
            {...target}
            canModify={canModify}
            onEdit={name => history.push({ state: { editTarget: name } })}
            onRemove={name => mutation.mutate({ targets: reject(targets, { name }) })}
        />
    ));

    return (
        <BoxGroup>
            <TargetsHeader>
                <h2>
                    <span>Targets</span>
                    {canModify && <Link to={{ state: { addTarget: true } }}>Add target</Link>}
                </h2>
                <p>Manage the allowable sequence targets for this barcode reference.</p>
            </TargetsHeader>

            {!targetComponents.length && <NoneFoundSection noun="targets" />}
            {targetComponents}
            {canModify && (
                <>
                    <AddTarget
                        names={name}
                        dataType={data_type}
                        refId={id}
                        targets={targets}
                        show={location.state?.addTarget}
                        onHide={() => history.replace({ state: { addTarget: false } })}
                    />
                    <EditTarget
                        targets={targets}
                        refId={id}
                        target={location.state?.editTarget && find(targets, { name: location.state.editTarget })}
                        show={location.state?.editTarget}
                        onHide={() => history.replace({ state: { editTarget: false } })}
                    />
                </>
            )}
        </BoxGroup>
    );
}
