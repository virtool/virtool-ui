import * as RadixSelect from "@radix-ui/react-select";
import React from "react";
import { cn } from "../../../app/utils";
import Label from "../../../base/Label";

type IndexSelectorItemProps = {
    id: string;
    name: string;
    version: number;
};

/**
 * A condensed index selector item for use in a list of indexes
 */
export default function IndexSelectorItem({
    id,
    name,
    version,
}: IndexSelectorItemProps) {
    return (
        <RadixSelect.Item
            className={cn(
                "capitalize",
                "flex",
                "items-center",
                "justify-between",
                "py-1.5",
                "px-6",
                "select-none",
                "text-base",
                "hover:bg-gray-100",
            )}
            key={id}
            value={id}
        >
            <RadixSelect.ItemText className="whitespace-nowrap">
                {name}
            </RadixSelect.ItemText>
            <span className={cn()}>
                Index Version <Label>{version}</Label>
            </span>
        </RadixSelect.Item>
    );
}
