import React from "react";
import { useLogout } from "../../account/queries";
import { AdministratorRoles } from "../../administration/types";
import { hasSufficientAdminRole } from "../../administration/utils";
import { useDialogParam } from "../../app/hooks";
import Dropdown from "../../base/Dropdown";
import DropdownMenuContent from "../../base/DropdownMenuContent";
import DropdownMenuItem from "../../base/DropdownMenuItem";
import DropdownMenuLink from "../../base/DropdownMenuLink";
import DropdownMenuTrigger from "../../base/DropdownMenuTrigger";
import IconButton from "../../base/IconButton";
import InitialIcon from "../../base/InitialIcon";
import Logo from "../../base/Logo";
import { useRootQuery } from "../../wall/queries";
import { NavLink } from "./NavLink";

type NavBarProps = {
    administrator_role: AdministratorRoles;
    handle: string;
};

/**
 * Display the main navigation bar with links too root level views.
 */
export default function Nav({ administrator_role, handle }: NavBarProps) {
    const { setOpen: setOpenDev } = useDialogParam("openDev");
    const mutation = useLogout();
    const { data } = useRootQuery();

    function onLogout() {
        mutation.mutate();
    }

    return (
        <nav className="bg-virtool flex justify-between text-white">
            <div className="flex items-center">
                <Logo className="pb-2.5 pl-10 pr-4" color="white" />
                <NavLink to="/jobs?state=preparing&state=running">Jobs</NavLink>
                <NavLink to="/samples">Samples</NavLink>
                <NavLink to="/refs">References</NavLink>
                <NavLink to="/hmm">HMM</NavLink>
                <NavLink to="/subtractions">Subtractions</NavLink>
                <NavLink to="/ml">ML</NavLink>
            </div>

            <div className="flex gap-2 pr-4">
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
                        <div className="bg-transparent flex items-center">
                            <InitialIcon handle={handle} size="md" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLink to="/account">
                            Signed in as <strong>{handle}</strong>
                        </DropdownMenuLink>

                        <div />

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
            </div>
        </nav>
    );
}
