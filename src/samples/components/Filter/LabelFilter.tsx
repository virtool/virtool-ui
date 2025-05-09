import Link from "@base/Link";
import SidebarHeader from "@base/SidebarHeader";
import SideBarSection from "@base/SideBarSection";
import React from "react";
import { Label } from "../../../labels/types";
import LabelFilterItem from "./LabelFilterItem";

type LabelFilterProps = {
    /** A list of labels */
    labels: Label[];
    /** Handles click event when label is clicked */
    onClick: (value: string) => void;
    /** A list of selected labels */
    selected: string[];
};

/**
 * Sidebar for filtering samples by labels
 */
export default function LabelFilter({
    labels,
    onClick,
    selected,
}: LabelFilterProps) {
    return (
        <SideBarSection>
            <SidebarHeader>
                Labels <Link to="/samples/labels">Manage</Link>
            </SidebarHeader>
            {labels.map((label) => (
                <LabelFilterItem
                    key={label.id}
                    {...label}
                    pressed={selected.includes(label.id.toString())}
                    onClick={onClick}
                />
            ))}
        </SideBarSection>
    );
}
