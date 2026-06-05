import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupTable from "@base/BoxGroupTable";
import ContainerNarrow from "@base/ContainerNarrow";
import ContainerSide from "@base/ContainerSide";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Markdown from "@base/Markdown";
import JobItem from "@jobs/components/JobItem";
import { useFetchJob } from "@jobs/queries";
import type { Label } from "@labels/types";
import { useFetchSample } from "@samples/queries";
import { getLibraryTypeDisplayName } from "@samples/utils";
/**
 * The general view in sample details
 */
import { getRouteApi } from "@tanstack/react-router";
import numbro from "numbro";
import EditSample from "../EditSample";
import SampleFileSizeWarning from "./SampleFileSizeWarning";
import Sidebar from "./Sidebar";

const routeApi = getRouteApi("/_authenticated/samples/$sampleId");

type SampleDetailGeneralProps = {
	labels: Label[];
};

export default function SampleDetailGeneral({
	labels,
}: SampleDetailGeneralProps) {
	const { sampleId } = routeApi.useParams();
	const search = routeApi.useSearch();
	const navigate = routeApi.useNavigate();
	const { data, isPending } = useFetchSample(sampleId);
	const { data: job } = useFetchJob(data?.job?.id ?? Number.NaN, data?.job);

	if (isPending || !data) {
		return <LoadingPlaceholder />;
	}

	const { quality } = data;

	return (
		<div className="flex items-stretch">
			<ContainerNarrow>
				{!data.ready && data.job && (
					<BoxGroup>
						<JobItem
							id={data.job.id}
							workflow={job?.workflow}
							state={job?.state}
							progress={job?.progress}
							createdAt={job?.createdAt}
							user={data.user}
						/>
					</BoxGroup>
				)}
				<SampleFileSizeWarning sampleId={sampleId} reads={data.reads} />
				<BoxGroup>
					<BoxGroupHeader>
						<h2>Metadata</h2>
						<p>User-defined information about the sample.</p>
					</BoxGroupHeader>
					<BoxGroupTable>
						<tbody>
							<tr>
								<th>Host</th>
								<td>{data.host}</td>
							</tr>
							<tr>
								<th>Isolate</th>
								<td>{data.isolate}</td>
							</tr>
							<tr>
								<th>Locale</th>
								<td>{data.locale}</td>
							</tr>
						</tbody>
					</BoxGroupTable>
				</BoxGroup>

				{data.ready && quality && (
					<BoxGroup>
						<BoxGroupHeader>
							<h2>Library</h2>
							<p>Information about the sequencing reads in this sample.</p>
						</BoxGroupHeader>
						<BoxGroupTable>
							<tbody>
								<tr>
									<th>Encoding</th>
									<td>{quality.encoding}</td>
								</tr>
								<tr>
									<th>Read Count</th>
									<td>{numbro(quality.count).format("0.0 a")}</td>
								</tr>
								<tr>
									<th>Library Type</th>
									<td>{getLibraryTypeDisplayName(data.library_type)}</td>
								</tr>
								<tr>
									<th>Length Range</th>
									<td>{quality.length.join(" - ")}</td>
								</tr>
								<tr>
									<th>GC Content</th>
									<td>{numbro(quality.gc / 100).format("0.0 %")}</td>
								</tr>
								<tr>
									<th>Paired</th>
									<td>{data.paired ? "Yes" : "No"}</td>
								</tr>
							</tbody>
						</BoxGroupTable>
					</BoxGroup>
				)}

				{data.ready && (
					<BoxGroup>
						<BoxGroupHeader>
							<h2>Notes</h2>
							<p>Additional notes about the sample.</p>
						</BoxGroupHeader>
						<Markdown markdown={data.notes} />
					</BoxGroup>
				)}
			</ContainerNarrow>

			<ContainerSide className="pl-[15px]">
				<Sidebar
					labels={labels}
					sampleId={data.id}
					sampleLabels={data.labels}
					defaultSubtractions={data.subtractions}
				/>
			</ContainerSide>

			<EditSample
				open={Boolean(search.openEditSample)}
				sample={data}
				setOpen={(openEditSample) =>
					navigate({ search: { ...search, openEditSample } })
				}
			/>
		</div>
	);
}
