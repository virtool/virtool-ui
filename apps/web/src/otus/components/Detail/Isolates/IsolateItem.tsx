import { formatIsolateName } from "@app/utils";
import Icon from "@base/Icon";
import Link from "@base/Link";
import type { OtuIsolate } from "@otus/types";
import { getRouteApi } from "@tanstack/react-router";
import { Star } from "lucide-react";

const routeApi = getRouteApi("/_authenticated/refs/$refId/otus/$otuId/otu");

type IsolateItemProps = {
	isolate: OtuIsolate;
};

/**
 * A condensed isolate item for use in a list of isolates
 */
export default function IsolateItem({ isolate }: IsolateItemProps) {
	const { refId, otuId } = routeApi.useParams();

	return (
		<Link
			to="/refs/$refId/otus/$otuId/otu/$isolateId"
			params={{ refId, otuId, isolateId: isolate.id }}
			className="flex items-center w-full py-3 px-6 text-inherit cursor-pointer hover:bg-gray-50"
			activeProps={{
				className: "shadow-[inset_3px_0_0_var(--color-virtool)]",
			}}
		>
			<span className="truncate">{formatIsolateName(isolate)}</span>
			{isolate.default && <Icon icon={Star} className="ml-auto" />}
		</Link>
	);
}
