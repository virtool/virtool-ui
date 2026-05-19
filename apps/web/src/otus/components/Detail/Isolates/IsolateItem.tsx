import { cn, formatIsolateName } from "@app/utils";
import BoxGroupSection from "@base/BoxGroupSection";
import Icon from "@base/Icon";
import type { OtuIsolate } from "@otus/types";
import { getRouteApi } from "@tanstack/react-router";
import { Star } from "lucide-react";

const routeApi = getRouteApi("/_authenticated/refs/$refId/otus/$otuId");

type IsolateItemProps = {
	/** Whether the Isolate is selected */
	active: boolean;
	isolate: OtuIsolate;
};

/**
 * A condensed isolate item for use in a list of isolates
 */
export default function IsolateItem({ active, isolate }: IsolateItemProps) {
	const navigate = routeApi.useNavigate();
	const search = routeApi.useSearch();

	return (
		<BoxGroupSection
			className={cn(
				"flex items-center border-none cursor-pointer hover:bg-gray-50",
				{
					"shadow-[inset_3px_0_0_var(--color-virtool)]": active,
				},
			)}
			onClick={() =>
				navigate({ search: { ...search, activeIsolate: isolate.id } })
			}
		>
			<span className="truncate">{formatIsolateName(isolate)}</span>
			{isolate.default && <Icon icon={Star} className="ml-auto" />}
		</BoxGroupSection>
	);
}
