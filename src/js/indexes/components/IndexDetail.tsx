import {
    ContainerNarrow,
    LoadingPlaceholder,
    NotFound,
    RelativeTime,
    SubviewHeader,
    SubviewHeaderAttribution,
    SubviewHeaderTitle,
} from "@base";
import Contributors from "@indexes/components/Contributors";
import Files from "@indexes/components/Files";
import IndexOTUs from "@indexes/components/OTUs";
import { useFetchIndex } from "@indexes/queries";
import { DownloadLink } from "@references/components/Detail/DownloadLink";
import { useGetReference } from "@references/queries";
import React from "react";
import styled from "styled-components";

const IndexDetailSubtitle = styled.div`
    align-items: center;
    display: flex;

    a {
        margin-left: auto;
    }
`;

export default function IndexDetail({ match }) {
    const { indexId, refId } = match.params;
    const { data, isLoading, isError } = useFetchIndex(indexId);
    const { data: reference, isLoading: isLoadingReference } = useGetReference(refId);

    if (isError) {
        return <NotFound />;
    }
    if (isLoading || isLoadingReference) {
        return <LoadingPlaceholder />;
    }

    const { version, created_at, user, id } = data;
    const { has_json } = reference.latest_build;

    return (
        <>
            <SubviewHeader>
                <SubviewHeaderTitle>Index {version}</SubviewHeaderTitle>
                <IndexDetailSubtitle>
                    <SubviewHeaderAttribution>
                        {user.handle} built <RelativeTime time={created_at} />
                    </SubviewHeaderAttribution>
                    {has_json && (
                        <DownloadLink href={`/api/indexes/${id}/files/reference.json.gz`}>Download</DownloadLink>
                    )}
                </IndexDetailSubtitle>
            </SubviewHeader>

            <ContainerNarrow>
                <Contributors contributors={data.contributors} />
                <Files files={data.files} />
                <IndexOTUs otus={data.otus} refId={refId} />
            </ContainerNarrow>
        </>
    );
}
