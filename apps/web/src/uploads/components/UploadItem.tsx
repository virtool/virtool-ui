import { byteSize } from "@app/utils";
import Attribution from "@base/Attribution";
import BoxGroupSection from "@base/BoxGroupSection";
import IconButton from "@base/IconButton";
import RelativeTime from "@base/RelativeTime";
import type { UserNested } from "@users/types";
import { Trash } from "lucide-react";
import type { ReactNode } from "react";
import { useDeleteFile } from "../queries";

export type UploadItemProps = {
	/** An extra control shown beside the remove button. */
	action?: ReactNode;
	canDelete: boolean;
	id: number;
	name: string;
	size: number;
	uploaded_at: string;
	user: UserNested | null;
};

export default function UploadItem({
	action,
	canDelete,
	id,
	name,
	size,
	uploaded_at,
	user,
}: UploadItemProps) {
	const { mutate: handleRemove } = useDeleteFile();

	return (
		<BoxGroupSection>
			<div className="grid grid-cols-3">
				<div className="flex font-medium items-center text-lg">{name}</div>
				<div className="flex">
					{user === null ? (
						<span>
							Retrieved <RelativeTime time={uploaded_at} />
						</span>
					) : (
						<Attribution
							time={uploaded_at}
							user={user.handle}
							verb="uploaded"
						/>
					)}
				</div>
				<div className="flex font-medium items-center gap-6 justify-end text-lg">
					<div>{byteSize(size, true)}</div>
					<span className="flex items-center gap-1">
						{action}
						{canDelete && (
							<IconButton
								color="red"
								IconComponent={Trash}
								tip="remove"
								onClick={() => handleRemove({ id })}
							/>
						)}
					</span>
				</div>
			</div>
		</BoxGroupSection>
	);
}
