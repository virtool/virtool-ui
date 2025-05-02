import Dropdown from "../../../base/Dropdown";
import DropdownButton from "../../../base/DropdownButton";
import DropdownMenuContent from "../../../base/DropdownMenuContent";
import DropdownMenuItem from "../../../base/DropdownMenuItem";
import Icon from "../../../base/Icon";
import { map } from "lodash-es";
import React from "react";
import styled from "styled-components";

const sortKeys = {
    pathoscope: ["coverage", "depth", "weight"],
    nuvs: ["length", "e", "orfs"],
};

const sortTitles = {
    coverage: "Coverage",
    depth: "Depth",
    e: "E-Value",
    length: "Length",
    orfs: "ORFs",
    weight: "Weight",
    identity: "Identity",
};

const sortWidths = {
    nuvs: "110px",
    pathoscope: "122px",
};

type SortDropdownButtonProps = {
    workflow: string;
};

const SortDropdownButton = styled(DropdownButton)<SortDropdownButtonProps>`
    align-items: center;
    display: flex;
    width: ${(props) => sortWidths[props.workflow]};

    i {
        margin-left: auto;
    }
`;

interface AnalysisViewerSortProps {
    workflow: string;
    sortKey: string;
    onSelect: (key: string) => void;
}
export function AnalysisViewerSort({
    workflow,
    sortKey,
    onSelect,
}: AnalysisViewerSortProps) {
    return (
        <Dropdown>
            <SortDropdownButton workflow={workflow}>
                <span>
                    <Icon name="sort" /> Sort: {sortTitles[sortKey]}
                </span>
                <Icon name="caret-down" />
            </SortDropdownButton>
            <DropdownMenuContent>
                {map(sortKeys[workflow], (key) => (
                    <DropdownMenuItem key={key} onSelect={() => onSelect(key)}>
                        {sortTitles[key]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </Dropdown>
    );
}
