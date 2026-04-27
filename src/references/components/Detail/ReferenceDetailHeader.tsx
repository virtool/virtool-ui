import { useDialogParam } from "@app/hooks";
import Icon from "@base/Icon";
import IconButton from "@base/IconButton";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderAttribution from "@base/ViewHeaderAttribution";
import ViewHeaderIcons from "@base/ViewHeaderIcons";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { useCheckReferenceRight } from "@references/hooks";
import { useLocation } from "@tanstack/react-router";
import { Lock, Pencil } from "lucide-react";

type ReferenceDetailHeaderProps = {
	createdAt: string;
	/** Whether the reference is installed remotely */
	isRemote: boolean;
	name: string;
	refId: string;
	userHandle: string;
};

/**
 * Displays header for reference with option to edit reference
 */
export default function ReferenceDetailHeader({
	createdAt,
	isRemote,
	name,
	refId,
	userHandle,
}: ReferenceDetailHeaderProps) {
	const { pathname: location } = useLocation();
	const { setOpen: setOpenEditReference } = useDialogParam("openEditReference");
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
							<IconButton
								color="grayDark"
								IconComponent={Pencil}
								tip="modify"
								onClick={() => setOpenEditReference(true)}
							/>
						)}
					</ViewHeaderIcons>
				)}
			</ViewHeaderTitle>
			<ViewHeaderAttribution time={createdAt} user={userHandle} />
		</ViewHeader>
	);
}
