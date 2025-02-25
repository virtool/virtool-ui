import { useUpdateReference } from "@references/queries";
import {
    formatSearchParams,
    useDialogParam,
    useUrlSearchParam,
} from "@utils/hooks";
import { find, map, reject } from "lodash-es";
import React from "react";
import styled from "styled-components";
import {
    BoxGroup,
    BoxGroupHeader,
    Link,
    NoneFoundSection,
} from "../../../../base";
import { ReferenceRight, useCheckReferenceRight } from "../../../hooks";
import { Reference } from "../../../types";
import AddTarget from "./AddTarget";
import EditTarget from "./EditTarget";
import { TargetItem } from "./TargetItem";

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
    const { data_type, targets, id } = reference;

    const { open: openAddTarget, setOpen: setOpenAddTarget } =
        useDialogParam("openAddTarget");
    const {
        value: editTargetId,
        setValue: setEditTargetId,
        unsetValue: unsetEditTargetId,
    } = useUrlSearchParam<string>("openEditTargetId");

    const { hasPermission: canModify } = useCheckReferenceRight(
        reference.id,
        ReferenceRight.modify,
    );
    const { mutation } = useUpdateReference(id);

    if (data_type !== "barcode") {
        return null;
    }

    const targetComponents = map(targets, (target) => (
        <TargetItem
            key={target.name}
            {...target}
            canModify={canModify}
            onEdit={(name) => setEditTargetId(name)}
            onRemove={(name) =>
                mutation.mutate({ targets: reject(targets, { name }) })
            }
        />
    ));

    return (
        <BoxGroup>
            <TargetsHeader>
                <h2>
                    <span>Targets</span>
                    {canModify && (
                        <Link to={formatSearchParams({ openAddTarget: true })}>
                            Add Target
                        </Link>
                    )}
                </h2>
                <p>
                    Manage the allowable sequence targets for this barcode
                    reference.
                </p>
            </TargetsHeader>

            {!targetComponents.length && <NoneFoundSection noun="targets" />}
            {targetComponents}
            {canModify && (
                <>
                    <AddTarget
                        refId={id}
                        targets={targets}
                        show={openAddTarget}
                        onHide={() => setOpenAddTarget(false)}
                    />
                    <EditTarget
                        targets={targets}
                        refId={id}
                        target={
                            editTargetId &&
                            find(targets, { name: editTargetId })
                        }
                        show={Boolean(editTargetId)}
                        onHide={unsetEditTargetId}
                    />
                </>
            )}
        </BoxGroup>
    );
}
