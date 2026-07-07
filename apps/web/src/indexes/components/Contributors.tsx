import Badge from "@base/Badge";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import { Empty, EmptyMedia, EmptyTitle } from "@base/Empty";
import { sortBy } from "es-toolkit";
import { CircleAlert } from "lucide-react";
import type { IndexContributor } from "../types";
import Contributor from "./Contributor";

type ContributorsProps = {
	contributors: IndexContributor[];
};

/**
 * A list of contributors for the index
 */
export default function Contributors({ contributors }: ContributorsProps) {
	const sorted = sortBy(contributors, [(c) => c.id, (c) => c.count]);

	const contributorComponents = sorted.map((contributor) => (
		<Contributor key={contributor.id} {...contributor} />
	));

	if (contributorComponents.length === 0) {
		contributorComponents.push(
			<BoxGroupSection key="noneFound">
				<Empty orientation="horizontal">
					<EmptyMedia>
						<CircleAlert size={18} />
					</EmptyMedia>
					<EmptyTitle>No contributors found</EmptyTitle>
				</Empty>
			</BoxGroupSection>,
		);
	}

	return (
		<BoxGroup>
			<BoxGroupHeader>
				<h2 className="flex gap-2">
					<span>Contributors</span>
					<Badge>{contributors.length}</Badge>
				</h2>
			</BoxGroupHeader>
			{contributorComponents}
		</BoxGroup>
	);
}
