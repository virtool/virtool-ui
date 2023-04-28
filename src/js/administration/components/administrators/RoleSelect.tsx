import { map } from "lodash-es";
import React from "react";
import { Select, SelectButton, SelectContent, SelectItem } from "../../../base";
import { AdministratorRole } from "../../types";

type RoleSelectProps = {
    roles: Array<AdministratorRole>;
    value: string;
    onChange: (value: string) => void;
    className?: string;
};

export const RoleSelect = ({ value, roles, onChange, className }: RoleSelectProps) => {
    const roleItems = map(roles, role => (
        <SelectItem value={role.id} key={role.id} text={`${role.id} Administrator`} description={role.description} />
    ));

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectButton placeholder="Select administrator role" icon="chevron-down" className={className} />
            <SelectContent position="popper" align="start">
                {roleItems}
            </SelectContent>
        </Select>
    );
};
