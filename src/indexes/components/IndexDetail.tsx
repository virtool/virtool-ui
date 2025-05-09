import { usePathParams } from "@app/hooks";
import React from "react";
import styled from "styled-components";
import ContainerNarrow from "../../base/ContainerNarrow";
import LoadingPlaceholder from "../../base/LoadingPlaceholder";
import NotFound from "../../base/NotFound";
import RelativeTime from "../../base/RelativeTime";
import SubviewHeader from "../../base/SubviewHeader";
import SubviewHeaderAttribution from "../../base/SubviewHeaderAttribution";
import SubviewHeaderTitle from "../../base/SubviewHeaderTitle";
import { DownloadLink } from "../../references/components/Detail/DownloadLink";
import { useGetReference } from "../../references/queries";
import { useFetchIndex } from "../queries";
import Contributors from "./Contributors";
import Files from "./IndexFiles";
import IndexOTUs from "./IndexOTUs";

const IndexDetailSubtitle = styled.div`
    align-items: center;
    display: flex;

    a {
        margin-left: auto;
    }
`;

/**
 * The index detailed view
 */
export default function IndexDetail() {
    const { indexId, refId } = usePathParams<{
        indexId: string;
        refId: string;
    }>();
    const {
        data: index,
        isPending: isPendingIndex,
        isError,
    } = useFetchIndex(indexId);
    const { data: reference, isPending: isPendingReference } =
        useGetReference(refId);

    if (isError) {
        return <NotFound />;
    }
    if (isPendingIndex || isPendingReference) {
        return <LoadingPlaceholder />;
    }

    const { contributors, created_at, files, id, otus, user, version } = index;

    return (
        <>
            <SubviewHeader>
                <SubviewHeaderTitle>Index {version}</SubviewHeaderTitle>
                <IndexDetailSubtitle>
                    <SubviewHeaderAttribution>
                        {user.handle} built <RelativeTime time={created_at} />
                    </SubviewHeaderAttribution>
                    {reference.latest_build?.has_json && (
                        <DownloadLink
                            href={`/api/indexes/${id}/files/reference.json.gz`}
                        >
                            Download
                        </DownloadLink>
                    )}
                </IndexDetailSubtitle>
            </SubviewHeader>

            <ContainerNarrow>
                <Contributors contributors={contributors} />
                <Files files={files} />
                <IndexOTUs otus={otus} refId={refId} />
            </ContainerNarrow>
        </>
    );
}
