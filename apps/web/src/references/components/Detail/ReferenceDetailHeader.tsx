import Icon from "@base/Icon";
import IconButton from "@base/IconButton";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderAttribution from "@base/ViewHeaderAttribution";
import ViewHeaderIcons from "@base/ViewHeaderIcons";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { useCheckReferenceRight } from "@references/hooks";
import { useLocation } from "@tanstack/react-router";
import { Archive, Lock, Pencil } from "lucide-react";

type ReferenceDetailHeaderProps = {
	createdAt: string;
	/** Whether the reference is installed remotely */
	isRemote: boolean;
	name: string;
	refId: string;
	setOpenArchiveReference?: (open: boolean) => void;
	setOpenEditReference?: (open: boolean) => void;
	userHandle: string;
};

/**
 * Displays header for an active reference with options to edit and archive.
 * Archived references use {@link ArchivedReferenceDetailHeader} instead.
 */
export default function ReferenceDetailHeader({
	createdAt,
	isRemote,
	name,
	refId,
	setOpenArchiveReference = () => {},
	setOpenEditReference = () => {},
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
								<IconButton
									color="grayDark"
									IconComponent={Pencil}
									tip="modify"
									onClick={() => setOpenEditReference(true)}
								/>
								<IconButton
									color="grayDark"
									IconComponent={Archive}
									tip="archive"
									onClick={() => setOpenArchiveReference(true)}
								/>
							</>
						)}
					</ViewHeaderIcons>
				)}
			</ViewHeaderTitle>
			<ViewHeaderAttribution time={createdAt} user={userHandle} />
		</ViewHeader>
	);
}
