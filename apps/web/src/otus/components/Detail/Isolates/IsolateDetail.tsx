import { formatIsolateName } from "@app/utils";
import IconButton from "@base/IconButton";
import Label from "@base/Label";
import Link from "@base/Link";
import { useCurrentOtuContext, useSetIsolateAsDefault } from "@otus/queries";
import { DownloadLink } from "@references/components/Detail/DownloadLink";
import {
	useCheckReferenceRight,
	useReferenceIsArchived,
} from "@references/hooks";
import Sequences from "@sequences/components/Sequences";
import { getRouteApi, Navigate } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Star, Trash } from "lucide-react";
import { useState } from "react";
import EditIsolate from "./EditIsolate";
import RemoveIsolate from "./RemoveIsolate";

const routeApi = getRouteApi(
	"/_authenticated/refs/$refId/otus/$otuId/isolates/$isolateId",
);

/**
 * Display and edit information for the selected Isolate
 */
export default function IsolateDetail() {
	const { refId, otuId, isolateId } = routeApi.useParams();
	const { otu, reference } = useCurrentOtuContext();
	const [openEdit, setOpenEdit] = useState(false);
	const [openRemove, setOpenRemove] = useState(false);
	const mutation = useSetIsolateAsDefault();
	const { hasPermission: canModify } = useCheckReferenceRight(
		reference.id,
		"modify",
	);
	const archived = useReferenceIsArchived(reference.id);
	const canModifyIsolates = canModify && !archived;

	const activeIsolate = otu.isolates.find(
		(isolate) => isolate.id === isolateId,
	);

	if (!activeIsolate) {
		return (
			<Navigate
				to="/refs/$refId/otus/$otuId/isolates"
				params={{ refId, otuId }}
				replace
			/>
		);
	}

	return (
		<div className="flex-1 min-w-0">
			<EditIsolate
				key={activeIsolate.id}
				otuId={otuId}
				isolateId={activeIsolate.id}
				sourceType={activeIsolate.source_type}
				sourceName={activeIsolate.source_name}
				allowedSourceTypes={reference.source_types}
				restrictSourceTypes={reference.restrict_source_types}
				show={openEdit}
				onHide={() => setOpenEdit(false)}
			/>

			<RemoveIsolate
				id={activeIsolate.id}
				name={formatIsolateName(activeIsolate)}
				onHide={() => setOpenRemove(false)}
				otuId={otuId}
				show={openRemove}
			/>

			<Link
				to="/refs/$refId/otus/$otuId/isolates"
				params={{ refId, otuId }}
				className="inline-flex items-center gap-1 mb-4 text-sm font-medium"
			>
				<ArrowLeft size={14} />
				Isolates
			</Link>

			<div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-4 mb-4">
				<div className="flex items-center gap-3 min-w-0">
					<h2 className="text-xl font-semibold truncate">
						{formatIsolateName(activeIsolate)}
					</h2>
					{activeIsolate.default && (
						<Label color="green">
							<Star size={14} />
							Default Isolate
						</Label>
					)}
				</div>
				<div className="flex items-center gap-1 shrink-0">
					{canModifyIsolates && (
						<>
							<IconButton
								IconComponent={Pencil}
								color="grayDark"
								tip="edit isolate"
								onClick={() => setOpenEdit(true)}
							/>
							{!activeIsolate.default && (
								<IconButton
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
								IconComponent={Trash}
								color="red"
								tip="remove isolate"
								onClick={() => setOpenRemove(true)}
							/>
						</>
					)}
					<DownloadLink
						href={`/api/otus/${otuId}/isolates/${activeIsolate.id}.fa`}
					>
						FASTA
					</DownloadLink>
				</div>
			</div>

			<Sequences otuId={otuId} activeIsolate={activeIsolate} />
		</div>
	);
}
