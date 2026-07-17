import Box from "@base/Box";
import BoxGroup from "@base/BoxGroup";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@base/Empty";
import Pagination from "@base/Pagination";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "@base/ViewHeaderTitleBadge";
import { Boxes, SearchX } from "lucide-react";
import { useSuspenseHmms } from "../queries";
import { HmmInstall } from "./HmmInstall";
import HmmItem from "./HmmItem";
import HmmToolbar from "./HmmToolbar";

type HmmListProps = {
	find: string;
	page: number;
	setSearch: (
		next: { find?: string; page?: number },
		options?: { replace?: boolean },
	) => void;
};

/**
 * A list of HMMs with filtering options
 */
export default function HmmList({ find, page, setSearch }: HmmListProps) {
	const { data } = useSuspenseHmms(page, 25, find);

	const {
		items,
		page: storedPage,
		page_count,
		found_count,
		total_count,
		status,
	} = data;

	return (
		<div>
			<ViewHeader title="HMMs">
				<ViewHeaderTitle>
					HMMs{" "}
					{status.task?.complete && (
						<ViewHeaderTitleBadge>{found_count}</ViewHeaderTitleBadge>
					)}
				</ViewHeaderTitle>
			</ViewHeader>

			{total_count ? (
				<>
					<HmmToolbar
						term={find}
						setTerm={(find) => setSearch({ find, page: 1 }, { replace: true })}
					/>
					{items.length ? (
						<Pagination
							items={items}
							storedPage={storedPage}
							currentPage={page}
							pageCount={page_count}
							onPageChange={(page) => setSearch({ page })}
						>
							<BoxGroup>
								{items.map((item) => (
									<HmmItem key={item.id} hmm={item} />
								))}
							</BoxGroup>
						</Pagination>
					) : (
						<Box>
							<Empty className="h-72">
								<EmptyMedia className="text-gray-400">
									{find ? (
										<SearchX size={40} strokeWidth={1.5} />
									) : (
										<Boxes size={40} strokeWidth={1.5} />
									)}
								</EmptyMedia>
								<EmptyTitle>No HMMs found</EmptyTitle>
								<EmptyDescription>
									{find ? "No HMMs match your search." : "No HMMs to show."}
								</EmptyDescription>
							</Empty>
						</Box>
					)}
				</>
			) : (
				<HmmInstall status={status} />
			)}
		</div>
	);
}
