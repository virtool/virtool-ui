import IndexSelectorItem from "@/analyses/components/Create/IndexSelectorItem";
import { Select, SelectButton, SelectContent } from "@/base";
import { cn } from "@/utils";
import { map } from "lodash";
import { sortBy } from "lodash-es";
import React, { useMemo } from "react";
import { CreateAnalysisFieldTitle } from "./CreateAnalysisFieldTitle";

type IndexSelectorProps = {
    indexes: object[];
    selected: string;
    onChange: (value: string) => void;
};

/**
 * A list of indexes available for analysis creation
 */
export function IndexSelector({
    indexes,
    selected,
    onChange,
}: IndexSelectorProps) {
    const sortedIndexes = useMemo(
        () => sortBy(indexes, "reference.name"),
        [indexes],
    );

    const indexItems = map(sortedIndexes, ({ reference, version, id }) => (
        <IndexSelectorItem
            key={id}
            id={id}
            name={reference.name}
            version={version}
        />
    ));

    return (
        <div className="mb-8">
            <CreateAnalysisFieldTitle>References</CreateAnalysisFieldTitle>
            <Select value={selected} onValueChange={onChange}>
                <SelectButton
                    className={cn("flex", "w-full")}
                    placeholder="Select a reference"
                    icon="chevron-down"
                />
                <SelectContent position="popper" align="start">
                    {indexItems}
                </SelectContent>
            </Select>
        </div>
    );
}
