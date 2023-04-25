import { map } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { Dropdown, DropdownButton, DropdownMenuItem, DropdownMenuList, Icon } from "../../../base";

const sortKeys = {
    aodp: ["identity"],
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
    aodp: "110px",
    pathoscope: "122px",
    nuvs: "110px",
};

type SortDropdownButtonProps = {
    workflow: string;
};

const SortDropdownButton = styled(DropdownButton)<SortDropdownButtonProps>`
    align-items: center;
    display: flex;
    width: ${props => sortWidths[props.workflow]};

    i {
        margin-left: auto;
    }
`;

interface AnalysisViewerSortProps {
    workflow: string;
    sortKey: string;
    onSelect: (key: string) => void;
}
export function AnalysisViewerSort({ workflow, sortKey, onSelect }: AnalysisViewerSortProps) {
    return (
        <Dropdown>
            <SortDropdownButton workflow={workflow}>
                <span>
                    <Icon name="sort" /> Sort: {sortTitles[sortKey]}
                </span>
                <Icon name="caret-down" />
            </SortDropdownButton>
            <DropdownMenuList>
                {map(sortKeys[workflow], key => (
                    <DropdownMenuItem key={key} onSelect={() => onSelect(key)}>
                        {sortTitles[key]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuList>
        </Dropdown>
    );
}
