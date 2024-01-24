import { map } from "lodash-es";
import React from "react";
import { Select, SelectButton, SelectContent, SelectItem } from "../../../base";
import { AdministratorRoles } from "../../types";

type RoleSelectProps = {
    roles: Array<AdministratorRoles>;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    id?: string;
};

export const RoleSelect = ({ value, roles, onChange, className, id }: RoleSelectProps) => {
    const roleItems = map(roles, role => (
        <SelectItem value={role.id} key={role.id} description={role.description}>
            {`${role.id} Administrator`}
        </SelectItem>
    ));

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectButton placeholder="Select administrator role" icon="chevron-down" className={className} id={id} />
            <SelectContent position="popper" align="start">
                {roleItems}
            </SelectContent>
        </Select>
    );
};
