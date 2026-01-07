import { cn } from "@app/utils";
import ScrollArea from "@base/ScrollArea";
import SelectBoxGroupSection from "@base/SelectBoxGroupSection";
import { sortBy } from "es-toolkit/compat";
import { GroupMinimal } from "../types";

type GroupSelectorProps = {
    groups: Array<GroupMinimal>;
    selectedGroupId?: number | string;
    setSelectedGroupId: (groupId: number | string) => void;
};

export function GroupSelector({
    selectedGroupId,
    setSelectedGroupId,
    groups,
}: GroupSelectorProps) {
    function isActive(id: number | string) {
        return selectedGroupId === id;
    }

    const groupComponents = sortBy(groups, (g) => g.name).map((group) => (
        <SelectBoxGroupSection
            active={isActive(group.id)}
            className={cn(
                "outline-1 outline-gray-300 font-medium",
                !isActive(group.id) && "hover:bg-gray-100",
            )}
            key={group.id}
            onClick={() => setSelectedGroupId(group.id)}
        >
            {group.name}
        </SelectBoxGroupSection>
    ));

    return (
        <ScrollArea className="col-span-1 w-full h-full bg-gray-100 border-b border-gray-300 mr-0">
            {groupComponents}
        </ScrollArea>
    );
}
