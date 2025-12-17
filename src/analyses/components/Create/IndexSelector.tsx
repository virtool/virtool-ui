import { cn } from "@app/utils";
import Label from "@base/Label";
import Select from "@base/Select";
import SelectButton from "@base/SelectButton";
import SelectContent from "@base/SelectContent";
import { IndexMinimal } from "@indexes/types";
import { sortBy } from "es-toolkit";
import { Select as SelectPrimitive } from "radix-ui";
import { useMemo } from "react";
import CreateAnalysisFieldTitle from "./CreateAnalysisFieldTitle";

type IndexSelectorItemProps = {
    id: string;
    name: string;
    version: number | string;
};

function IndexSelectorItem({ id, name, version }: IndexSelectorItemProps) {
    return (
        <SelectPrimitive.Item
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
            <SelectPrimitive.ItemText className="whitespace-nowrap">
                {name}
            </SelectPrimitive.ItemText>
            <span>
                Index Version <Label>{version}</Label>
            </span>
        </SelectPrimitive.Item>
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
        () => sortBy(indexes, [(index) => index.reference.name]),
        [indexes],
    );

    const indexItems = sortedIndexes.map(({ reference, version, id }) => (
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
