import Badge from "@base/Badge";
import Icon from "@base/Icon";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderAttribution from "@base/ViewHeaderAttribution";
import ViewHeaderIcons from "@base/ViewHeaderIcons";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { useCheckReferenceRight } from "@references/hooks";
import type { Reference } from "@references/types";
import { useLocation } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import ArchiveReference from "./ArchiveReference";

type ArchivedReferenceDetailHeaderProps = {
	createdAt: string;
	/** The reference details */
	detail: Reference;
	/** Whether the reference is installed remotely */
	isRemote: boolean;
	name: string;
	refId: string;
	userHandle: string;
};

/**
 * Header for an archived reference. Shows the archived badge and an
 * unarchive action; all other modifications are blocked.
 */
export default function ArchivedReferenceDetailHeader({
	createdAt,
	detail,
	isRemote,
	name,
	refId,
	userHandle,
}: ArchivedReferenceDetailHeaderProps) {
	const { pathname: location } = useLocation();
	const { hasPermission: canModify } = useCheckReferenceRight(refId, "modify");

	const showIcons = location.endsWith("/manage");

	return (
		<ViewHeader title={name}>
			<ViewHeaderTitle className="text-2xl font-semibold text-gray-700 leading-tight">
				{name}
				<Badge className="ml-3" color="gray" variant="soft">
					Archived
				</Badge>
				{showIcons && (
					<ViewHeaderIcons>
						{isRemote && <Icon color="gray" icon={Lock} aria-label="lock" />}
						{!isRemote && canModify && <ArchiveReference detail={detail} />}
					</ViewHeaderIcons>
				)}
			</ViewHeaderTitle>
			<ViewHeaderAttribution time={createdAt} user={userHandle} />
		</ViewHeader>
	);
}
