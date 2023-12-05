import React from "react";
import { useCheckAdminRoleOrPermission } from "../../administration/hooks";
import { Icon, InputSearch, LinkButton, Toolbar } from "../../base";
import { useUrlSearchParams } from "../../utils/hooks";

export default function ReferenceToolbar() {
    const [term, setTerm] = useUrlSearchParams("find", "");
    const { hasPermission: canCreate } = useCheckAdminRoleOrPermission("create_ref");

    const createButton = canCreate ? (
        <LinkButton
            to={{ pathname: "/refs/add", state: { newReference: true, emptyReference: true } }}
            color="blue"
            tip="Create"
        >
            <Icon name="plus-square fa-fw" />
        </LinkButton>
    ) : null;

    return (
        <Toolbar>
            <InputSearch placeholder="Reference name" value={term} onChange={e => setTerm(e.target.value)} />
            {createButton}
        </Toolbar>
    );
}
