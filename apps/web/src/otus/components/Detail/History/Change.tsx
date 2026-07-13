import Attribution from "@base/Attribution";
import BoxGroupSection from "@base/BoxGroupSection";
import Icon from "@base/Icon";
import IconButton from "@base/IconButton";
import Label from "@base/Label";
import { useRevertOtu } from "@otus/queries";
import type { OtuNested } from "@otus/types";
import type { UserNested } from "@users/types";
import {
	AlertTriangle,
	ArrowUpCircle,
	Copy,
	Dna,
	FileUp,
	FlaskConical,
	History,
	Link,
	Pencil,
	PlusSquare,
	Star,
	Trash,
} from "lucide-react";

const methodIconProps = {
	add_isolate: {
		icon: FlaskConical,
		color: "blue",
	},
	create: {
		icon: PlusSquare,
		color: "blue",
	},
	create_sequence: {
		icon: Dna,
		color: "blue",
	},
	edit: {
		icon: Pencil,
		color: "orange",
	},
	edit_isolate: {
		icon: FlaskConical,
		color: "orange",
	},
	edit_sequence: {
		icon: Dna,
		color: "orange",
	},
	clone: {
		icon: Copy,
		color: "blue",
	},
	import: {
		icon: FileUp,
		color: "blue",
	},
	remote: {
		icon: Link,
		color: "blue",
	},
	remove: {
		icon: Trash,
		color: "red",
	},
	remove_isolate: {
		icon: FlaskConical,
		color: "red",
	},
	remove_sequence: {
		icon: Dna,
		color: "red",
	},
	set_as_default: {
		icon: Star,
		color: "orange",
	},
	update: {
		icon: ArrowUpCircle,
		color: "orange",
	},
};

function getMethodIcon(methodName: string) {
	const props = methodIconProps[methodName] ?? {
		icon: AlertTriangle,
		color: "red",
	};

	return <Icon {...props} />;
}

type ChangeProps = {
	id: string;
	archived?: boolean;
	createdAt: string;
	description: string;
	methodName: string;
	otu: OtuNested;
	unbuilt: boolean;
	user: UserNested;
};

/**
 * A condensed change item for use in a list of changes
 */
export default function Change({
	id,
	archived = false,
	createdAt,
	description,
	methodName,
	otu,
	unbuilt,
	user,
}: ChangeProps) {
	const mutation = useRevertOtu(otu.id);

	const showRevert = unbuilt && !archived;

	return (
		<BoxGroupSection
			className="grid items-center"
			style={{
				gridTemplateColumns: showRevert ? "42px 2fr 1fr 15px" : "42px 2fr 1fr",
			}}
		>
			<div>
				<Label>{otu.version}</Label>
			</div>

			<div className="flex items-center gap-2">
				{getMethodIcon(methodName)}
				<span>{description || "No Description"}</span>
			</div>

			<Attribution time={createdAt} user={user.handle} verb="" />

			{showRevert && (
				<IconButton
					IconComponent={History}
					tip="revert"
					onClick={() => mutation.mutate({ changeId: id })}
				/>
			)}
		</BoxGroupSection>
	);
}
