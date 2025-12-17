import { cn } from "@app/utils";
import Label from "@base/Label";
import { Select as SelectPrimitive } from "radix-ui";

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
        <SelectPrimitive.Item
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
            <SelectPrimitive.ItemText className="whitespace-nowrap">
                {name}
            </SelectPrimitive.ItemText>
            <span className={cn()}>
                Index Version <Label>{version}</Label>
            </span>
        </SelectPrimitive.Item>
    );
}
