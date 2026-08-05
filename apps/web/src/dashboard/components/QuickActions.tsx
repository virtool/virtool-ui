import { buttonVariants } from "@base/buttonVariants";
import Link from "@base/Link";
import { FilePlus2, Plus } from "lucide-react";

/** Shortcuts to the tasks a user most often lands on the dashboard to start. */
export default function QuickActions() {
	// `Button as={Link}` types `to` and `search` away, so the router props are
	// lost at the call site. Styling the link directly keeps them.
	return (
		<div className="flex flex-wrap gap-3 mb-8">
			<Link className={buttonVariants({ color: "blue" })} to="/samples/create">
				<Plus size={16} />
				New Sample
			</Link>
			<Link
				className={buttonVariants({ color: "gray" })}
				search={{ page: 1 }}
				to="/samples/files"
			>
				<FilePlus2 size={16} />
				Upload Read Files
			</Link>
		</div>
	);
}
