import { cn, formatIsolateName } from "@app/utils";
import BoxGroupSection from "@base/BoxGroupSection";
import Icon from "@base/Icon";
import type { OtuIsolate } from "@otus/types";
import { Star } from "lucide-react";
import { useOtuDetailSearch } from "../OtuDetailSearchContext";

type IsolateItemProps = {
	/** Whether the Isolate is selected */
	active: boolean;
	isolate: OtuIsolate;
};

/**
 * A condensed isolate item for use in a list of isolates
 */
export default function IsolateItem({ active, isolate }: IsolateItemProps) {
	const { setSearch } = useOtuDetailSearch();

	return (
		<BoxGroupSection
			className={cn("flex items-center border-none", {
				"shadow-[inset_3px_0_0_var(--color-virtool)]": active,
			})}
			onClick={() => setSearch({ activeIsolate: isolate.id })}
		>
			<span className="truncate">{formatIsolateName(isolate)}</span>
			{isolate.default && <Icon icon={Star} className="ml-auto" />}
		</BoxGroupSection>
	);
}
