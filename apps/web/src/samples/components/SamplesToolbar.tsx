import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import { buttonVariants } from "@base/buttonVariants";
import InputSearch from "@base/InputSearch";
import Link from "@base/Link";
import Toolbar from "@base/Toolbar";
import type { ChangeEvent } from "react";

type SampleToolbarProps = {
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;

	term: string;
};

/**
 * A toolbar allowing samples to be filtered by name
 */
export default function SampleToolbar({ onChange, term }: SampleToolbarProps) {
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
			{canCreate && (
				<Link
					className={buttonVariants({ color: "blue" })}
					to="/samples/create"
				>
					Create
				</Link>
			)}
		</Toolbar>
	);
}
