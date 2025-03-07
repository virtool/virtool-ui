import { Icon, IconButton, InitialIcon, Logo } from "@/base";
import { useDialogParam } from "@/hooks";
import { useLogout } from "@account/queries";
import { AdministratorRoles } from "@administration/types";
import { hasSufficientAdminRole } from "@administration/utils";
import Dropdown from "@base/Dropdown";
import DropdownMenuContent from "@base/DropdownMenuContent";
import DropdownMenuItem from "@base/DropdownMenuItem";
import DropdownMenuLink from "@base/DropdownMenuLink";
import DropdownMenuTrigger from "@base/DropdownMenuTrigger";
import { useRootQuery } from "@wall/queries";
import React from "react";
import styled from "styled-components";
import { NavBarLink } from "./NavBarLink";

const NavBarLeft = styled.div`
    display: flex;
    align-items: center;
`;

const NavBarRight = styled.div`
    display: flex;
    align-items: center;
    margin-right: calc(100% - 100vw + 20px);
`;

const NavBarLogo = styled(Logo)`
    margin: 0 30px 0 35px;
`;

const NavDropdownButton = styled.div`
    align-items: center;
    background: transparent;
    border: none;
    color: ${(props) => props.theme.color.white};
    cursor: pointer;
    display: flex;
    height: 45px;
    outline: none;
    padding: 0 10px;

    &:focus {
        color: ${(props) => props.theme.color.primaryDarkest};
    }

    *:not(:last-child) {
        margin-right: 3px;
    }

    i {
        padding-left: 5px;
    }
`;

const NavDivider = styled.div`
    color: ${(props) => props.theme.color.greyLight};
    border-top: 2px solid;
`;

const StyledNavBar = styled.div`
    background-color: ${(props) => props.theme.color.primary};
    color: white;
    display: flex;
    height: 45px;
    justify-content: space-between;
`;

type NavBarProps = {
    administrator_role: AdministratorRoles;
    handle: string;
};

/**
 * Displays the navigation bar with routes to available components
 */
export default function NavBar({ administrator_role, handle }: NavBarProps) {
    const { setOpen: setOpenDev } = useDialogParam("openDev");
    const mutation = useLogout();
    const { data } = useRootQuery();

    function onLogout() {
        if (
            window.virtool.b2c.enabled &&
            window.msalInstance.getActiveAccount()
        ) {
            window.msalInstance.logoutRedirect();
        } else {
            mutation.mutate();
        }
    }

    return (
        <StyledNavBar>
            <NavBarLeft>
                <NavBarLogo color="white" />
                <NavBarLink to="/jobs?state=preparing&state=running">
                    Jobs
                </NavBarLink>
                <NavBarLink to="/samples">Samples</NavBarLink>
                <NavBarLink to="/refs">References</NavBarLink>
                <NavBarLink to="/hmm">HMM</NavBarLink>
                <NavBarLink to="/subtractions">Subtractions</NavBarLink>
                <NavBarLink to="/ml">ML</NavBarLink>
            </NavBarLeft>

            <NavBarRight>
                {data?.dev && (
                    <IconButton
                        onClick={() => setOpenDev(true)}
                        name="bug"
                        tip="dev tools"
                        color="red"
                    />
                )}

                <Dropdown>
                    <DropdownMenuTrigger>
                        <NavDropdownButton>
                            <InitialIcon handle={handle} size="md" />
                            <Icon name="caret-down" />
                        </NavDropdownButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLink to="/account">
                            Signed in as <strong>{handle}</strong>
                        </DropdownMenuLink>

                        <NavDivider />
                        <DropdownMenuLink to="/account">
                            Account
                        </DropdownMenuLink>
                        {hasSufficientAdminRole(
                            AdministratorRoles.USERS,
                            administrator_role,
                        ) && (
                            <DropdownMenuLink to="/administration">
                                Administration{" "}
                            </DropdownMenuLink>
                        )}
                        <DropdownMenuItem>
                            <a
                                target="_blank"
                                href="https://virtool.ca/docs/manual/start/installation/"
                                rel="noopener noreferrer"
                                className="text-black hover:text-black"
                            >
                                Documentation
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={onLogout}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </Dropdown>
            </NavBarRight>
        </StyledNavBar>
    );
}
