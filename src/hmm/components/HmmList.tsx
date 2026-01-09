import { usePageParam, useUrlSearchParam } from "@app/hooks";
import BoxGroup from "@base/BoxGroup";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import Pagination from "@base/Pagination";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "@base/ViewHeaderTitleBadge";
import { useListHmms } from "../queries";
import { HmmInstall } from "./HmmInstall";
import HmmItem from "./HmmItem";
import HmmToolbar from "./HmmToolbar";

/**
 * A list of HMMs with filtering options
 */
export default function HmmList() {
    const { page } = usePageParam();
    const { value: term, setValue: setTerm } =
        useUrlSearchParam<string>("find");
    const { data, isPending } = useListHmms(page, 25, term);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const {
        documents,
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
                        <ViewHeaderTitleBadge>
                            {found_count}
                        </ViewHeaderTitleBadge>
                    )}
                </ViewHeaderTitle>
            </ViewHeader>

            {total_count ? (
                <>
                    <HmmToolbar
                        term={term}
                        onChange={(e) => setTerm(e.target.value)}
                    />
                    {documents.length ? (
                        <Pagination
                            items={documents}
                            storedPage={storedPage}
                            currentPage={page}
                            pageCount={page_count}
                        >
                            <BoxGroup>
                                {documents.map((document) => (
                                    <HmmItem key={document.id} hmm={document} />
                                ))}
                            </BoxGroup>
                        </Pagination>
                    ) : (
                        <NoneFoundBox noun="HMMs" />
                    )}
                </>
            ) : (
                <HmmInstall />
            )}
        </div>
    );
}
