import BoxGroup from "@base/BoxGroup";
import ContainerNarrow from "@base/ContainerNarrow";
import ListEmpty from "@base/ListEmpty";
import Pagination from "@base/Pagination";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "@base/ViewHeaderTitleBadge";
import { Library } from "lucide-react";
import { useState } from "react";
import { useSuspenseReferences } from "../queries";
import Clone from "./CloneReference";
import { CreateReference } from "./CreateReference";
import { ReferenceItem } from "./ReferenceItem";
import ReferenceToolbar from "./ReferenceToolbar";

type ReferenceListProps = {
	archived?: boolean;
	term?: string;
	page?: number;
	setSearch?: (
		next: {
			archived?: boolean;
			term?: string;
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
	term = "",
	page = 1,
	setSearch = () => {},
}: ReferenceListProps) {
	const [isCreateReferenceOpen, setIsCreateReferenceOpen] = useState(false);
	const [cloneReferenceId, setCloneReferenceId] = useState<string>();

	const { data } = useSuspenseReferences(page, 25, term, archived);

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
					term={term}
					onCreate={() => setIsCreateReferenceOpen(true)}
					setArchived={(archived) => setSearch({ archived, page: 1 })}
					setTerm={(term) => setSearch({ term, page: 1 }, { replace: true })}
				/>
				<CreateReference
					open={isCreateReferenceOpen}
					onOpenChange={setIsCreateReferenceOpen}
				/>
				{!items.length ? (
					<ListEmpty
						icon={Library}
						title={`No ${archived ? "archived references" : "references"} found`}
						description={
							archived
								? "No references have been archived yet."
								: "No references have been created yet."
						}
					/>
				) : (
					<Pagination
						items={items}
						storedPage={storedPage}
						currentPage={page}
						pageCount={page_count}
						onPageChange={(page) => setSearch({ page })}
					>
						<BoxGroup as="ul">
							{items.map((item) => (
								<ReferenceItem
									key={item.id}
									as="li"
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
