import React from "react";
import { connect } from "react-redux";
import { Badge, Tabs, TabsLink } from "../../../base";

export const ReferenceDetailTabs = ({ id, otuCount }) => (
    <Tabs>
        <TabsLink to={`/refs/${id}/manage`}>Manage</TabsLink>
        <TabsLink to={`/refs/${id}/otus`}>
            OTUs <Badge>{otuCount}</Badge>
        </TabsLink>
        <TabsLink to={`/refs/${id}/indexes`}>Indexes</TabsLink>
        <TabsLink to={`/refs/${id}/settings`}>Settings</TabsLink>
    </Tabs>
);

export const mapStateToProps = state => ({
    id: state.references.detail.id,
    otuCount: state.references.detail.otu_count
});

export default connect(mapStateToProps)(ReferenceDetailTabs);
