import { cn } from "@app/utils";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import NoneFound from "@base/NoneFound";
import { GroupMinimal } from "@groups/types";
import React from "react";

type AccountGroupsProps = {
    /** A list of groups associated with the account */
    groups: GroupMinimal[];
};

/**
 * Displays the groups associated with the account
 */
export default function AccountGroups({ groups }: AccountGroupsProps) {
    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>Groups</h2>
            </BoxGroupHeader>
            <BoxGroupSection className="flex flex-wrap gap-2">
                {groups.length ? (
                    groups
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(({ id, name }) => (
                            <span
                                className={cn(
                                    "bg-slate-500",
                                    "inline-flex",
                                    "font-medium",
                                    "items-center",
                                    "text-white",
                                    "px-2 py-1",
                                    "rounded",
                                )}
                                key={id}
                            >
                                {name}
                            </span>
                        ))
                ) : (
                    <NoneFound noun="groups" />
                )}
            </BoxGroupSection>
        </BoxGroup>
    );
}
