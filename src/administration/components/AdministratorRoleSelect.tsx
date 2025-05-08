import { AdministratorRole } from "@administration/types";
import Select from "@base/Select";
import SelectButton from "@base/SelectButton";
import SelectContent from "@base/SelectContent";
import SelectItem from "@base/SelectItem";
import React from "react";

type RoleSelectProps = {
    className?: string;
    id?: string;
    onChange: (value: string) => void;
    roles: AdministratorRole[];
    value: string;
};

export default function AdministratorRoleSelect({
    className,
    id,
    onChange,
    roles,
    value,
}: RoleSelectProps) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectButton
                placeholder="Select administrator role"
                icon="chevron-down"
                className={className}
                id={id}
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
