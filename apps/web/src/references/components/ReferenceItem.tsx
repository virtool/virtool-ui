import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import Attribution from "@base/Attribution";
import Badge from "@base/Badge";
import BoxGroupSection from "@base/BoxGroupSection";
import IconButton from "@base/IconButton";
import Link from "@base/Link";
import ProgressCircle from "@base/ProgressCircle";
import type { ReferenceMinimal } from "@references/types";
import { useFetchTask } from "@tasks/queries";
import { Copy } from "lucide-react";
import type { ElementType, ReactNode } from "react";

type ReferenceItemProps = {
	/** The element or component to render as the root (e.g. `"li"` in a list) */
	as?: ElementType;
	onClone: (id: string) => void;
	reference: ReferenceMinimal;
};

/**
 * A condensed reference item for use in a list of references
 */
export function ReferenceItem({ as, onClone, reference }: ReferenceItemProps) {
	const { archived, created_at, id, name, task, user } = reference;

	const { data: liveTask } = useFetchTask(task?.id ?? Number.NaN, task);
	const activeTask = liveTask ?? task;

	const { hasPermission: canCreate } =
		useCheckAdminRoleOrPermission("create_ref");

	let end: ReactNode = null;

	if (activeTask && !activeTask.complete) {
		end = (
			<ProgressCircle
				progress={activeTask.progress || 0}
				state={activeTask.complete ? "succeeded" : "running"}
			/>
		);
	} else if (archived) {
		end = (
			<Badge color="gray" variant="soft">
				Archived
			</Badge>
		);
	} else if (canCreate) {
		end = (
			<IconButton
				IconComponent={Copy}
				tip="clone"
				color="blue"
				onClick={() => onClone(id)}
			/>
		);
	}

	return (
		<BoxGroupSection as={as} className="grid grid-cols-3 items-center gap-x-4">
			<Link
				className="font-medium text-lg"
				to="/refs/$refId"
				params={{ refId: id }}
			>
				{name}
			</Link>
			<Attribution time={created_at} user={user.handle} />
			<div className="flex h-10 items-center justify-end">{end}</div>
		</BoxGroupSection>
	);
}
