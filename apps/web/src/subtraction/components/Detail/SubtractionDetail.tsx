import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NotFound from "@base/NotFound";
import Table from "@base/Table";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderIcons from "@base/ViewHeaderIcons";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { useFetchSubtraction } from "@subtraction/queries";
import type { NucleotideComposition } from "@subtraction/types";
import numbro from "numbro";
import { SubtractionAttribution } from "../Attribution";
import DeleteSubtraction from "./DeleteSubtraction";
import EditSubtraction from "./EditSubtraction";
import SubtractionFiles from "./SubtractionFiles";

function calculateGc(nucleotides: NucleotideComposition) {
	return numbro(1 - nucleotides.a - nucleotides.t - nucleotides.n).format(
		"0.000",
	);
}

/**
 * The subtraction detailed view
 */
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/_authenticated/subtractions/$subtractionId");

export default function SubtractionDetail() {
	const { subtractionId } = routeApi.useParams();

	const { data, isPending, isError } = useFetchSubtraction(subtractionId);
	const { hasPermission: canModify } =
		useCheckAdminRoleOrPermission("modify_subtraction");

	if (isError) {
		return <NotFound />;
	}

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	if (!data.ready || !data.gc) {
		return <LoadingPlaceholder message="Subtraction is still being imported" />;
	}

	return (
		<>
			<ViewHeader title={data.name}>
				<ViewHeaderTitle>
					{data.name}
					{canModify && (
						<ViewHeaderIcons>
							<EditSubtraction subtraction={data} />
							<DeleteSubtraction subtraction={data} />
						</ViewHeaderIcons>
					)}
				</ViewHeaderTitle>
				{data.user ? (
					<SubtractionAttribution
						handle={data.user.handle}
						time={data.created_at}
					/>
				) : null}
			</ViewHeader>
			<Table>
				<tbody>
					<tr>
						<th>Nickname</th>
						<td>{data.nickname}</td>
					</tr>
					<tr>
						<th>File</th>
						<td>{data.file.name || data.file.id}</td>
					</tr>
					<tr>
						<th>Sequence Count</th>
						<td>{data.count}</td>
					</tr>
					<tr>
						<th>GC Estimate</th>
						<td>{calculateGc(data.gc)}</td>
					</tr>
					<tr>
						<th>Linked Samples</th>
						<td>{data.linked_samples.length}</td>
					</tr>
				</tbody>
			</Table>
			<SubtractionFiles files={data.files} />
		</>
	);
}
