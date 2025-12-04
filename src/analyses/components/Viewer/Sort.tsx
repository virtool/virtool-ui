import Dropdown from "@base/Dropdown";
import DropdownButton from "@base/DropdownButton";
import DropdownMenuContent from "@base/DropdownMenuContent";
import DropdownMenuItem from "@base/DropdownMenuItem";
import { map } from "lodash-es";
import { ArrowUpDown, ChevronDown } from "lucide-react";

const sortKeys = {
    pathoscope: ["coverage", "depth", "weight"],
    nuvs: ["length", "e", "orfs"],
    iimi: ["name", "probability", "coverage"],
};

const sortTitles = {
    coverage: "Coverage",
    depth: "Depth",
    e: "E-Value",
    length: "Length",
    orfs: "ORFs",
    weight: "Weight",
    identity: "Identity",
    name: "Name",
    probability: "PScore",
};

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
            <DropdownButton className="flex items-center">
                <span>
                    <ArrowUpDown className="size-1" /> Sort:{" "}
                    {sortTitles[sortKey]}
                </span>
                <ChevronDown size={18} />
            </DropdownButton>
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
