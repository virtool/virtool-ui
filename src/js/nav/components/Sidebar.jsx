import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { getAccountAdministratorRole } from "../../account/selectors";
import { AdministratorRoles } from "../../administration/types";
import { hasSufficientAdminRole } from "../../administration/utils";
import SidebarItem from "./SidebarItem";

const StyledSidebar = styled.nav`
    align-items: center;
    top: 45px;
    left: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    width: 78px;
    padding: 45px 0 0 15px;
    position: fixed;
`;

export const Sidebar = ({ fullAdministrator }) => (
    <Switch>
        <Route path="/jobs">
            <StyledSidebar>
                <SidebarItem exclude={["/jobs/settings"]} title="Browse" link="/jobs" icon="th-list" />
            </StyledSidebar>
        </Route>
        <Route path="/samples">
            <StyledSidebar>
                <SidebarItem
                    exclude={["/samples/files", "/samples/labels", "/samples/settings"]}
                    title="Browse"
                    link="/samples"
                    icon="th-list"
                />
                <SidebarItem title="Files" link="/samples/files?page=1" icon="folder-open" />
                <SidebarItem title="Labels" link="/samples/labels" icon="fas fa-tag" />
                {fullAdministrator ? <SidebarItem title="Settings" link="/samples/settings" icon="cogs" /> : null}
            </StyledSidebar>
        </Route>
        <Route path="/refs">
            <StyledSidebar>
                <SidebarItem exclude={["/refs/settings"]} title="Browse" link="/refs" icon="th-list" />
                {fullAdministrator ? <SidebarItem title="Settings" link="/refs/settings" icon="cogs" /> : null}
            </StyledSidebar>
        </Route>
        <Route path="/subtractions">
            <StyledSidebar>
                <SidebarItem exclude={["/subtractions/files"]} title="Browse" link="/subtractions" icon="th-list" />
                <SidebarItem title="Files" link="/subtractions/files?page=1" icon="folder-open" />
            </StyledSidebar>
        </Route>
        <Route path="/hmm">
            <StyledSidebar>
                <SidebarItem exclude={["/hmm/settings"]} title="Browse" link="/hmm" icon="th-list" />
            </StyledSidebar>
        </Route>
    </Switch>
);

const mapStateToProps = state => ({
    fullAdministrator: hasSufficientAdminRole(AdministratorRoles.FULL, getAccountAdministratorRole(state)),
});

export default connect(mapStateToProps, null)(Sidebar);
