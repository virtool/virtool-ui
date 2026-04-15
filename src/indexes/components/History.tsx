import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { sortBy } from "es-toolkit";
import type { ReactNode } from "react";

type HistoryDocument = {
	id: string;
	description: string;
	otu: { name: string };
};

function RebuildHistoryEllipsis({ unbuilt }) {
	if (unbuilt.page_count > 1) {
		return (
			<BoxGroupSection className="text-right" key="last-item">
				+ {unbuilt.total_count - unbuilt.per_page} more changes
			</BoxGroupSection>
		);
	}
}

function RebuildHistoryItem({ description, otuName }) {
	return (
		<BoxGroupSection className="grid grid-cols-2">
			<strong>{otuName}</strong>

			{description || "No Description"}
		</BoxGroupSection>
	);
}

export default function RebuildHistory({ unbuilt }) {
	let content: ReactNode;

	if (unbuilt === null) {
		content = <LoadingPlaceholder className="mt-5" />;
	} else {
		const historyComponents = sortBy(
			(unbuilt.documents ?? []) as HistoryDocument[],
			[(doc) => doc.otu.name],
		).map((change) => (
			<RebuildHistoryItem
				key={change.id}
				description={change.description}
				otuName={change.otu.name}
			/>
		));

		content = (
			<div className="max-h-screen overflow-y-auto">
				{historyComponents}
				<RebuildHistoryEllipsis unbuilt={unbuilt} />
			</div>
		);
	}

	return (
		<BoxGroup>
			<BoxGroupHeader>Changes</BoxGroupHeader>
			{content}
		</BoxGroup>
	);
}
