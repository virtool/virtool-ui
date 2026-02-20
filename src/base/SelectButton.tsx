import { borderRadius, getBorder, getColor, getFontWeight } from "@app/theme";
import Icon from "@base/Icon";
import { LucideIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import styled from "styled-components";

const SelectTrigger = styled(SelectPrimitive.Trigger)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    background-color: ${({ theme }) => getColor({ color: "white", theme })};
    border: ${getBorder};
    border-radius: ${borderRadius.sm};
    font-weight: ${getFontWeight("thick")};
    text-transform: capitalize;

    svg {
        margin-left: 5px;
    }
`;

type SelectButtonProps = {
    placeholder?: string;
    className?: string;
    icon: LucideIcon;
    id?: string;
};

export default function SelectButton({
    placeholder,
    icon: LucideIcon,
    className,
    id,
}: SelectButtonProps) {
    return (
        <SelectTrigger className={className} id={id}>
            <SelectPrimitive.Value placeholder={placeholder} />
            <Icon icon={LucideIcon} />
        </SelectTrigger>
    );
}
