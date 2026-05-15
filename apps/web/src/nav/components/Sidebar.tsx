import type { AdministratorRoleName } from "@administration/types";
import { hasSufficientAdminRole } from "@administration/utils";
import { cn } from "@app/utils";
import { useLocation } from "@tanstack/react-router";
import { FolderOpen, List, Settings, Tag } from "lucide-react";
import SidebarLink from "./SidebarLink";

type SidebarProps = {
	administratorRole: AdministratorRoleName;
};

/**
 * Displays the sidebar with routes to manage the component
 */
export default function Sidebar({ administratorRole }: SidebarProps) {
	const fullAdministrator = hasSufficientAdminRole("full", administratorRole);
	const { pathname } = useLocation();

	let links = null;

	if (pathname.startsWith("/jobs")) {
		links = (
			<SidebarLink
				exclude={["/jobs/settings"]}
				title="Browse"
				link="/jobs"
				icon={List}
			/>
		);
	} else if (pathname.startsWith("/samples")) {
		links = (
			<>
				<SidebarLink
					exclude={["/samples/uploads", "/samples/labels", "/samples/settings"]}
					title="Browse"
					link="/samples"
					icon={List}
				/>
				<SidebarLink title="Files" link="/samples/files" icon={FolderOpen} />
				<SidebarLink title="Labels" link="/samples/labels" icon={Tag} />
				{fullAdministrator ? (
					<SidebarLink
						title="Settings"
						link="/samples/settings"
						icon={Settings}
					/>
				) : null}
			</>
		);
	} else if (pathname.startsWith("/refs")) {
		links = (
			<>
				<SidebarLink
					exclude={["/refs/settings"]}
					title="Browse"
					link="/refs"
					icon={List}
				/>
				{fullAdministrator ? (
					<SidebarLink title="Settings" link="/refs/settings" icon={Settings} />
				) : null}
			</>
		);
	} else if (pathname.startsWith("/subtractions")) {
		links = (
			<>
				<SidebarLink
					exclude={["/subtractions/uploads"]}
					title="Browse"
					link="/subtractions"
					icon={List}
				/>
				<SidebarLink
					title="Files"
					link="/subtractions/files?page=1"
					icon={FolderOpen}
				/>
			</>
		);
	} else if (pathname.startsWith("/hmm")) {
		links = (
			<SidebarLink
				exclude={["/hmm/settings"]}
				title="Browse"
				link="/hmm"
				icon={List}
			/>
		);
	}

	return (
		<div
			className={cn(
				"items-center",
				"flex flex-col",
				"bottom-0 left-0 top-30",
				"fixed",
				"pl-6 pb-2",
			)}
		>
			{links}
		</div>
	);
}
