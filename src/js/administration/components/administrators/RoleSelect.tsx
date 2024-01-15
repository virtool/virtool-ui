import * as RadixSelect from "@radix-ui/react-select";
import { map } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { getColor, getFontSize, getFontWeight } from "../../../app/theme";
import { Select, SelectButton, SelectContent, SelectItem } from "../../../base";
import { AdministratorRoles } from "../../types";

const Description = styled.div`
    font-size: ${getFontSize("sm")};
    font-weight: ${getFontWeight("normal")};
    color: ${({ theme }) => getColor({ color: "greyDarkest", theme })};
    margin-top: 5px;
    white-space: pre-wrap;
`;

type RoleSelectProps = {
    roles: Array<AdministratorRoles>;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    id?: string;
};

export const RoleSelect = ({ value, roles, onChange, className, id }: RoleSelectProps) => {
    const roleItems = map(roles, role => (
        <SelectItem value={role.id} key={role.id}>
            <RadixSelect.ItemText>{`${role.id} Administrator`} </RadixSelect.ItemText>
            <Description>{role.description}</Description>
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
