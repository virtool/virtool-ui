import Badge from "@base/Badge";
import Button from "@base/Button";
import Icon from "@base/Icon";
import IconButton from "@base/IconButton";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderAttribution from "@base/ViewHeaderAttribution";
import ViewHeaderIcons from "@base/ViewHeaderIcons";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { useCheckReferenceRight } from "@references/hooks";
import { useLocation } from "@tanstack/react-router";
import { Archive, ArchiveRestore, Lock, Pencil } from "lucide-react";

type ReferenceDetailHeaderProps = {
	archived: boolean;
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
 * Displays header for reference with options to edit and archive
 */
export default function ReferenceDetailHeader({
	archived,
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

	if (archived) {
		return (
			<ViewHeader title={name}>
				<div className="flex items-start gap-4">
					<div className="flex flex-1 items-center gap-3 min-w-0">
						<div className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 text-gray-500">
							<Archive size={18} />
						</div>
						<div className="min-w-0 flex-1">
							<ViewHeaderTitle className="text-2xl font-semibold text-gray-700 leading-tight">
								{name}
								<Badge className="ml-3" color="gray" variant="outline">
									Archived
								</Badge>
								{showIcons && isRemote && (
									<ViewHeaderIcons>
										<Icon color="grey" icon={Lock} aria-label="lock" />
									</ViewHeaderIcons>
								)}
							</ViewHeaderTitle>
							<ViewHeaderAttribution time={createdAt} user={userHandle} />
						</div>
					</div>
					{showIcons && !isRemote && canModify && (
						<Button
							color="gray"
							size="large"
							onClick={() => setOpenArchiveReference(true)}
						>
							<ArchiveRestore size={16} />
							Unarchive
						</Button>
					)}
				</div>
			</ViewHeader>
		);
	}

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
