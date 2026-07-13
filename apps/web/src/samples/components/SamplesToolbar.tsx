import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import InputSearch from "@base/InputSearch";
import Toolbar from "@base/Toolbar";
import type { Label } from "@labels/types";
import type { ChangeEvent } from "react";
import CreateSample from "./Create/CreateSample";

type SampleToolbarProps = {
	labels: Label[];
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	term: string;
};

/**
 * A toolbar allowing samples to be filtered by name
 */
export default function SampleToolbar({
	labels,
	onChange,
	term,
}: SampleToolbarProps) {
	const { hasPermission: canCreate } =
		useCheckAdminRoleOrPermission("create_sample");

	return (
		<Toolbar>
			<div className="flex-grow">
				<InputSearch
					value={term || ""}
					onChange={onChange}
					placeholder="Sample name"
				/>
			</div>
			{canCreate && <CreateSample labels={labels} />}
		</Toolbar>
	);
}
