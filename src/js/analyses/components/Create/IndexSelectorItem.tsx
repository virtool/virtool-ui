import { Label } from "@/base";
import * as RadixSelect from "@radix-ui/react-select";
import { cn } from "@utils/utils";
import React from "react";

type IndexSelectorItemProps = {
    id: string;
    name: string;
    version: number;
};

/**
 * A condensed index selector item for use in a list of indexes
 */
export function IndexSelectorItem({
    id,
    name,
    version,
}: IndexSelectorItemProps) {
    return (
        <RadixSelect.Item
            className={cn(
                "flex",
                "justify-between",
                "items-center",
                "text-base",
                "cursor-pointer",
                "capitalize",
                "select-none",
                "mb-1",
                "py-1.5",
                "px-6",
                "hover:bg-blue-50",
                "hover:border-0",
            )}
            value={name}
            key={id}
        >
            <RadixSelect.ItemText>
                <span
                    className={cn(
                        "font-medium",
                        "overflow-hidden",
                        "text-ellipsis",
                        "whitespace-nowrap",
                    )}
                >
                    {name}
                </span>
            </RadixSelect.ItemText>
            <span
                className={cn(
                    "flex-[0_1_auto]",
                    "whitespace-nowrap",
                    "font-normal",
                )}
            >
                Index Version <Label>{version}</Label>
            </span>
        </RadixSelect.Item>
    );
}
