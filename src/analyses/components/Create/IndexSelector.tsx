import { cn } from "@app/utils";
import Label from "@base/Label";
import Select from "@base/Select";
import SelectButton from "@base/SelectButton";
import SelectContent from "@base/SelectContent";
import { IndexMinimal } from "@indexes/types";
import * as RadixSelect from "@radix-ui/react-select";
import { map } from "lodash";
import { sortBy } from "lodash-es";
import React, { useMemo } from "react";
import CreateAnalysisFieldTitle from "./CreateAnalysisFieldTitle";

type IndexSelectorItemProps = {
    id: string;
    name: string;
    version: number | string;
};

function IndexSelectorItem({ id, name, version }: IndexSelectorItemProps) {
    return (
        <RadixSelect.Item
            className={cn(
                "capitalize",
                "flex",
                "items-center",
                "justify-between",
                "py-1.5",
                "px-6",
                "text-base",
                "hover:bg-gray-100",
            )}
            key={id}
            value={id}
        >
            <RadixSelect.ItemText className="whitespace-nowrap">
                {name}
            </RadixSelect.ItemText>
            <span>
                Index Version <Label>{version}</Label>
            </span>
        </RadixSelect.Item>
    );
}

type IndexSelectorProps = {
    indexes: IndexMinimal[];
    selected: string;
    onChange: (value: string) => void;
};

/**
 * A list of indexes available for analysis creation
 */
export default function IndexSelector({
    indexes,
    selected,
    onChange,
}: IndexSelectorProps) {
    const sortedIndexes = useMemo<IndexMinimal[]>(
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
            <CreateAnalysisFieldTitle>Reference</CreateAnalysisFieldTitle>
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
