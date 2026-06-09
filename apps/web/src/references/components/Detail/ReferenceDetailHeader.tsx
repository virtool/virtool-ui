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
import EditReference from "./EditReference";

type ReferenceDetailHeaderProps = {
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
 * Displays header for an active reference with options to edit and archive.
 * Archived references use {@link ArchivedReferenceDetailHeader} instead.
 */
export default function ReferenceDetailHeader({
	createdAt,
	detail,
	isRemote,
	name,
	refId,
	userHandle,
}: ReferenceDetailHeaderProps) {
	const { pathname: location } = useLocation();
	const { hasPermission: canModify } = useCheckReferenceRight(refId, "modify");

	const showIcons = location.endsWith("/manage");

	return (
		<ViewHeader title={name}>
			<ViewHeaderTitle>
				{name}
				{showIcons && (
					<ViewHeaderIcons>
						{isRemote && <Icon color="grey" icon={Lock} aria-label="lock" />}
						{!isRemote && canModify && (
							<>
								<EditReference detail={detail} />
								<ArchiveReference detail={detail} />
							</>
						)}
					</ViewHeaderIcons>
				)}
			</ViewHeaderTitle>
			<ViewHeaderAttribution time={createdAt} user={userHandle} />
		</ViewHeader>
	);
}
