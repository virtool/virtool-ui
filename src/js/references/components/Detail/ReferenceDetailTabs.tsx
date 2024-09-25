import { Badge, Tabs, TabsLink } from "@base";
import React from "react";

type ReferenceDetailTabsProps = {
    id: string;
    otuCount: number;
};

/**
 * Displays tabs to navigate through the detailed view of a reference
 */
export default function ReferenceDetailTabs({ id, otuCount }: ReferenceDetailTabsProps) {
    return (
        <Tabs>
            <TabsLink to={`/refs/${id}/manage`}>Manage</TabsLink>
            <TabsLink to={`/refs/${id}/otus`}>
                OTUs <Badge>{otuCount}</Badge>
            </TabsLink>
            <TabsLink to={`/refs/${id}/indexes`}>Indexes</TabsLink>
            <TabsLink to={`/refs/${id}/settings`}>Settings</TabsLink>
        </Tabs>
    );
}
