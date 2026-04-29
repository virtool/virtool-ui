import BoxGroup from "@base/BoxGroup";
import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Pagination from "@base/Pagination";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "@base/ViewHeaderTitleBadge";
import { useFindReferences } from "../queries";
import Clone from "./CloneReference";
import { CreateReference } from "./CreateReference";
import { ReferenceItem } from "./ReferenceItem";
import ReferenceOfficial from "./ReferenceOfficial";
import ReferenceToolbar from "./ReferenceToolbar";

type ReferenceListProps = {
	cloneReferenceId?: string;
	createReferenceType?: string;
	find?: string;
	page?: number;
	setSearch?: (next: {
		cloneReferenceId?: string;
		createReferenceType?: string;
		find?: string;
		page?: number;
	}) => void;
};

/**
 * A list of references with filtering options
 */
export default function ReferenceList({
	cloneReferenceId,
	createReferenceType,
	find = "",
	page = 1,
	setSearch = () => {},
}: ReferenceListProps) {
	const { data, isPending } = useFindReferences(page, 25, find);

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	const {
		items,
		page: storedPage,
		page_count,
		total_count,
		official_installed,
	} = data;

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
					find={find}
					setCreateReferenceType={(createReferenceType) =>
						setSearch({ createReferenceType })
					}
					setFind={(find) => setSearch({ find })}
				/>
				<CreateReference
					createReferenceType={createReferenceType}
					setCreateReferenceType={(createReferenceType) =>
						setSearch({ createReferenceType })
					}
				/>
				<ReferenceOfficial officialInstalled={official_installed} />
				{total_count !== 0 && (
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
									onClone={(cloneReferenceId) =>
										setSearch({ cloneReferenceId })
									}
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
				unsetCloneReferenceId={() => setSearch({ cloneReferenceId: undefined })}
			/>
		</>
	);
}
