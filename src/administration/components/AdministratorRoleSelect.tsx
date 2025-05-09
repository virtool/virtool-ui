import {
    AdministratorRole,
    AdministratorRoleName,
} from "@administration/types";
import Select from "@base/Select";
import SelectButton from "@base/SelectButton";
import SelectContent from "@base/SelectContent";
import SelectItem from "@base/SelectItem";
import React from "react";

type RoleSelectProps = {
    id: string;
    onChange: (value: AdministratorRoleName) => void;
    roles: AdministratorRole[];
    value: AdministratorRoleName;
};

export default function AdministratorRoleSelect({
    id,
    onChange,
    roles,
    value,
}: RoleSelectProps) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectButton
                className="max-w-56"
                icon="chevron-down"
                id={id}
                placeholder="Select administrator role"
            />
            <SelectContent position="popper" align="start">
                {roles.map((role) => (
                    <SelectItem
                        value={role.id}
                        key={role.id}
                        description={role.description}
                    >
                        {`${role.id} Administrator`}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
