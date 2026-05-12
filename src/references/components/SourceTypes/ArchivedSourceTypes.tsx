import BoxGroup from "@base/BoxGroup";
import BoxGroupSection from "@base/BoxGroupSection";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import SectionHeader from "@base/SectionHeader";
import { useFetchReference } from "@references/queries";
import { getRouteApi } from "@tanstack/react-router";
import { Lock } from "lucide-react";

const routeApi = getRouteApi("/_authenticated/refs/$refId");

export function ArchivedSourceTypes() {
	const { refId } = routeApi.useParams();
	const { data, isPending } = useFetchReference(refId);

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	const sourceTypes = data?.source_types ?? [];

	return (
		<section>
			<SectionHeader>
				<div className="flex items-baseline justify-between">
					<h2>Source Types</h2>
					<span className="text-xs font-medium text-gray-500 inline-flex items-center gap-1">
						<Lock size={12} /> read-only — archived
					</span>
				</div>
			</SectionHeader>
			<BoxGroup className="opacity-70">
				{sourceTypes.length ? (
					sourceTypes.map((sourceType) => (
						<BoxGroupSection
							key={sourceType}
							className="flex items-center justify-between"
						>
							<span className="capitalize text-gray-600">{sourceType}</span>
							<span aria-hidden className="text-gray-300 select-none text-base">
								×
							</span>
						</BoxGroupSection>
					))
				) : (
					<BoxGroupSection className="text-gray-500 text-sm">
						No source types configured.
					</BoxGroupSection>
				)}
			</BoxGroup>
		</section>
	);
}
