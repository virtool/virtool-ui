import Badge from "@base/Badge";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import type { OtuHistory } from "@otus/types";
import { sortBy } from "es-toolkit";
import Change from "./Change";

type HistoryListProps = {
	/** Whether revert is disabled because the parent reference is archived */
	archived?: boolean;
	/** The history of built or unbuilt changes */
	history: OtuHistory[];
	/** Whether the changes are unbuilt */
	unbuilt?: boolean;
};

/**
 * Displays a history list of changes with options to revert the OTU
 */
export default function HistoryList({
	archived,
	history,
	unbuilt = false,
}: HistoryListProps) {
	const changes = sortBy(history, [(h) => h.otu.version]).reverse();

	const changeComponents = changes.map((change) => (
		<Change
			key={change.id}
			id={change.id}
			archived={archived}
			methodName={change.method_name}
			otu={change.otu}
			user={change.user}
			description={change.description}
			createdAt={change.created_at}
			unbuilt={unbuilt}
		/>
	));

	return (
		<BoxGroup>
			<BoxGroupHeader>
				<h2 className="flex gap-2 items-center">
					<span>{unbuilt ? "Unb" : "B"}uilt Changes</span>
					<Badge>{changes.length}</Badge>
				</h2>
			</BoxGroupHeader>
			{changeComponents}
		</BoxGroup>
	);
}
