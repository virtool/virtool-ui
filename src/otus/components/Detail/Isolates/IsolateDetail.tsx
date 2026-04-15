import { useDialogParam } from "@app/hooks";
import { formatIsolateName } from "@app/utils";
import Box from "@base/Box";
import Icon from "@base/Icon";
import IconButton from "@base/IconButton";
import Label from "@base/Label";
import { useSetIsolateAsDefault } from "@otus/queries";
import type { OtuIsolate } from "@otus/types";
import { DownloadLink } from "@references/components/Detail/DownloadLink";
import Sequences from "@sequences/components/Sequences";
import { Pencil, Star, Trash } from "lucide-react";
import EditIsolate from "./EditIsolate";
import RemoveIsolate from "./RemoveIsolate";

type IsolateDetailProps = {
	/** The Isolate that is currently selected */
	activeIsolate: OtuIsolate;
	allowedSourceTypes: string[];
	/** Whether the user has permission to modify the Isolate */
	canModify: boolean;
	otuId: string;
	/** Indicates whether the source types are restricted */
	restrictSourceTypes: boolean;
};

/**
 * Display and edit information for Isolates
 */
export default function IsolateDetail({
	activeIsolate,
	allowedSourceTypes,
	canModify,
	otuId,
	restrictSourceTypes,
}: IsolateDetailProps) {
	const { open: openEditIsolate, setOpen: setOpenEditIsolate } =
		useDialogParam("openEditIsolate");

	const { open: openRemoveIsolate, setOpen: setOpenRemoveIsolate } =
		useDialogParam("openRemoveIsolate");

	const mutation = useSetIsolateAsDefault();

	return (
		<div className="flex-1 min-h-0 min-w-0">
			<EditIsolate
				key={activeIsolate.id}
				otuId={otuId}
				isolateId={activeIsolate.id}
				sourceType={activeIsolate.source_type}
				sourceName={activeIsolate.source_name}
				allowedSourceTypes={allowedSourceTypes}
				restrictSourceTypes={restrictSourceTypes}
				show={openEditIsolate}
				onHide={() => setOpenEditIsolate(false)}
			/>

			<RemoveIsolate
				id={activeIsolate.id}
				name={formatIsolateName(activeIsolate)}
				onHide={() => setOpenRemoveIsolate(false)}
				otuId={otuId}
				show={openRemoveIsolate}
			/>

			<Box className="flex items-center text-base justify-between">
				<div className="font-bold">{formatIsolateName(activeIsolate)}</div>
				<div>
					{activeIsolate.default && (
						<Label color="green">
							<Icon className="pl-1" icon={Star} /> Default Isolate
						</Label>
					)}
					{canModify && (
						<>
							<IconButton
								className="pl-1"
								IconComponent={Pencil}
								color="grayDark"
								tip="edit isolate"
								onClick={() => setOpenEditIsolate(true)}
							/>
							{!activeIsolate.default && (
								<IconButton
									className="pl-1"
									IconComponent={Star}
									color="green"
									tip="set as default"
									onClick={() =>
										mutation.mutate({
											otuId,
											isolateId: activeIsolate.id,
										})
									}
								/>
							)}
							<IconButton
								className="pl-1"
								IconComponent={Trash}
								color="red"
								tip="remove isolate"
								onClick={() => setOpenRemoveIsolate(true)}
							/>
						</>
					)}
					<DownloadLink
						className="ml-1"
						href={`/api/otus/${otuId}/isolates/${activeIsolate.id}.fa`}
					>
						FASTA
					</DownloadLink>
				</div>
			</Box>

			<Sequences otuId={otuId} activeIsolate={activeIsolate} />
		</div>
	);
}
