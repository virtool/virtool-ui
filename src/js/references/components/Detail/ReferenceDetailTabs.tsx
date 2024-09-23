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
            <TabsLink to={`/manage`}>Manage</TabsLink>
            <TabsLink to={`/otus`}>
                OTUs <Badge>{otuCount}</Badge>
            </TabsLink>
            <TabsLink to={`/indexes`}>Indexes</TabsLink>
            <TabsLink to={`/settings`}>Settings</TabsLink>
        </Tabs>
    );
}
