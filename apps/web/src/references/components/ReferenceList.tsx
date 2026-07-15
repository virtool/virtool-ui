import Box from "@base/Box";
import BoxGroup from "@base/BoxGroup";
import ContainerNarrow from "@base/ContainerNarrow";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@base/Empty";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Pagination from "@base/Pagination";
import QueryError from "@base/QueryError";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "@base/ViewHeaderTitleBadge";
import { Library } from "lucide-react";
import { useState } from "react";
import { useFindReferences } from "../queries";
import Clone from "./CloneReference";
import { CreateReference } from "./CreateReference";
import { ReferenceItem } from "./ReferenceItem";
import ReferenceToolbar from "./ReferenceToolbar";

type ReferenceListProps = {
	archived?: boolean;
	find?: string;
	page?: number;
	setSearch?: (
		next: {
			archived?: boolean;
			find?: string;
			page?: number;
		},
		options?: { replace?: boolean },
	) => void;
};

/**
 * A list of references with filtering options
 */
export default function ReferenceList({
	archived = false,
	find = "",
	page = 1,
	setSearch = () => {},
}: ReferenceListProps) {
	const [isCreateReferenceOpen, setIsCreateReferenceOpen] = useState(false);
	const [cloneReferenceId, setCloneReferenceId] = useState<string>();

	const { data, isPending, isError } = useFindReferences(
		page,
		25,
		find,
		archived,
	);

	if (isError && !data) {
		return <QueryError noun="references" />;
	}

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	const { items, page: storedPage, page_count, total_count } = data;

	return (
		<>
			<ContainerNarrow>
				<ViewHeader title="References">
					<ViewHeaderTitle>
						References{" "}
						<ViewHeaderTitleBadge>{total_count}</ViewHeaderTitleBadge>
					</ViewHeaderTitle>
				</ViewHeader>
				<ReferenceToolbar
					archived={archived}
					find={find}
					onCreate={() => setIsCreateReferenceOpen(true)}
					setArchived={(archived) => setSearch({ archived, page: 1 })}
					setFind={(find) => setSearch({ find, page: 1 }, { replace: true })}
				/>
				<CreateReference
					open={isCreateReferenceOpen}
					onOpenChange={setIsCreateReferenceOpen}
				/>
				{!items.length ? (
					<Box>
						<Empty className="h-72">
							<EmptyMedia className="text-gray-400">
								<Library size={40} strokeWidth={1.5} />
							</EmptyMedia>
							<EmptyTitle>
								No {archived ? "archived references" : "references"} found
							</EmptyTitle>
							<EmptyDescription>
								{archived
									? "No references have been archived yet."
									: "No references have been created yet."}
							</EmptyDescription>
						</Empty>
					</Box>
				) : (
					<Pagination
						items={items}
						storedPage={storedPage}
						currentPage={page}
						pageCount={page_count}
						onPageChange={(page) => setSearch({ page })}
					>
						<BoxGroup>
							{items.map((item) => (
								<ReferenceItem
									key={item.id}
									onClone={setCloneReferenceId}
									reference={item}
								/>
							))}
						</BoxGroup>
					</Pagination>
				)}
			</ContainerNarrow>
			<Clone
				cloneReferenceId={cloneReferenceId}
				references={items}
				unsetCloneReferenceId={() => setCloneReferenceId(undefined)}
			/>
		</>
	);
}
