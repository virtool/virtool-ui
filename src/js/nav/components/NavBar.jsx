import { MenuButton } from "@reach/menu-button";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { logout } from "../../account/actions";
import { getAccountHandle } from "../../account/selectors";
import { AdministratorRoles } from "../../administration/types";
import { hasSufficientAdminRole } from "../../administration/utils";
import { Dropdown, DropdownMenuItem, DropdownMenuLink, DropdownMenuList, Icon, InitialIcon, Logo } from "../../base";
import { NavBarItem } from "./NavBarItem";

const NavBarLeft = styled.div`
    display: flex;
    align-items: center;
`;

NavBarLeft.displayName = "NavBarLeft";

const NavBarRight = styled.div`
    display: flex;
    align-items: center;
    margin-right: calc(100% - 100vw + 20px);
`;

NavBarRight.displayName = "NavBarRight";

const NavBarLogo = styled(Logo)`
    margin: 0 30px 0 35px;
`;

NavBarLogo.displayName = "NavBarLogo";

const NavDropdownButton = styled(MenuButton)`
    align-items: center;
    background: transparent;
    border: none;
    color: ${props => props.theme.color.white};
    cursor: pointer;
    display: flex;
    height: 45px;
    outline: none;
    padding: 0 10px;

    :focus {
        color: ${props => props.theme.color.primaryDarkest};
    }

    *:not(:last-child) {
        margin-right: 3px;
    }
`;

NavDropdownButton.displayName = "NavDropdownButton";

const NavDivider = styled.div`
    color: ${props => props.theme.color.greyLight};
    border-top: 2px solid;
`;

NavDivider.displayName = "NavDivider";

const StyledNavBar = styled.div`
    background-color: ${props => props.theme.color.primary};
    color: white;
    display: flex;
    height: 45px;
    justify-content: space-between;
`;

StyledNavBar.displayName = "NavBar";

export const Bar = ({ administrator, administrator_role, dev, userId, onLogout, handle }) => (
    <StyledNavBar>
        <NavBarLeft>
            <NavBarLogo color="white" />
            <NavBarItem to="/jobs">Jobs</NavBarItem>
            <NavBarItem to="/samples">Samples</NavBarItem>
            <NavBarItem to="/refs">References</NavBarItem>
            <NavBarItem to="/hmm">HMM</NavBarItem>
            <NavBarItem to="/subtractions">Subtractions</NavBarItem>
        </NavBarLeft>

        <NavBarRight>
            {dev && (
                <NavBarItem to={{ state: { devCommands: true } }}>
                    <Icon color="red" name="bug" />
                </NavBarItem>
            )}

            <Dropdown>
                <NavDropdownButton>
                    <InitialIcon handle={handle} size="md" />
                    <span>{userId}</span>
                    <Icon name="caret-down" />
                </NavDropdownButton>
                <DropdownMenuList>
                    <DropdownMenuLink to="/account">
                        Signed in as <strong>{handle}</strong>
                    </DropdownMenuLink>

                    <NavDivider />
                    <DropdownMenuLink to="/account">Account</DropdownMenuLink>
                    {hasSufficientAdminRole(AdministratorRoles.USERS, administrator_role) && (
                        <DropdownMenuLink to="/administration">Administration </DropdownMenuLink>
                    )}
                    <DropdownMenuLink
                        target="_blank"
                        to="//virtool.ca/docs/manual/start/installation/"
                        rel="noopener noreferrer"
                    >
                        Documentation
                    </DropdownMenuLink>
                    <DropdownMenuItem onSelect={onLogout}>Logout</DropdownMenuItem>
                </DropdownMenuList>
            </Dropdown>
        </NavBarRight>
    </StyledNavBar>
);

export const mapStateToProps = state => ({
    ...state.account,
    dev: state.app.dev,
    pending: state.app.pending,
    handle: getAccountHandle(state)
});

export const mapDispatchToProps = dispatch => ({
    onLogout: () => {
        if (window.b2c.use && window.msalInstance.getActiveAccount()) window.msalInstance.logoutRedirect();
        else dispatch(logout());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Bar);
