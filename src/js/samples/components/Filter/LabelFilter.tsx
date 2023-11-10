import React from "react";
import { Link } from "react-router-dom";
import { SidebarHeader, SideBarSection } from "../../../base";
import { Label } from "../../../labels/types";
import { LabelFilterItem } from "./LabelFilterItem";

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
export default function LabelFilter({ labels, onClick, selected }: LabelFilterProps) {
    return (
        <SideBarSection>
            <SidebarHeader>
                Labels <Link to="/samples/labels">Manage</Link>
            </SidebarHeader>
            {Array.isArray(labels)
                ? labels.map(label => (
                      <LabelFilterItem
                          key={label.id}
                          {...label}
                          pressed={selected.includes(label.id.toString())}
                          onClick={onClick}
                      />
                  ))
                : null}
        </SideBarSection>
    );
}
