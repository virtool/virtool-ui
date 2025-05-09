import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import { useUrlSearchParam } from "@app/hooks";
import Attribution from "@base/Attribution";
import BoxGroupSection from "@base/BoxGroupSection";
import IconButton from "@base/IconButton";
import Link from "@base/Link";
import ProgressCircle from "@base/ProgressCircle";
import { Permission } from "@groups/types";
import { JobState } from "@jobs/types";
import { ReferenceMinimal } from "@references/types";
import React from "react";

type ReferenceItemProps = {
    reference: ReferenceMinimal;
};

/**
 * A condensed reference item for use in a list of references
 */
export function ReferenceItem({ reference }: ReferenceItemProps) {
    const { setValue: setCloneReferenceId } =
        useUrlSearchParam<string>("cloneReferenceId");

    const { created_at, id, name, task, user } = reference;

    const { hasPermission: canCreate } = useCheckAdminRoleOrPermission(
        Permission.create_ref,
    );

    let end: React.ReactNode = null;

    if (task && !task.complete) {
        end = (
            <ProgressCircle
                progress={task.progress || 0}
                state={task.complete ? JobState.complete : JobState.running}
            />
        );
    } else if (canCreate) {
        end = (
            <IconButton
                name="clone"
                tip="clone"
                color="blue"
                onClick={() => setCloneReferenceId(id)}
            />
        );
    }

    return (
        <BoxGroupSection className="grid grid-cols-3 items-center">
            <Link className="font-medium text-lg" to={`/refs/${id}`}>
                {name}
            </Link>
            <Attribution time={created_at} user={user.handle} />
            <div className="flex justify-end">{end}</div>
        </BoxGroupSection>
    );
}
