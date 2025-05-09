import { usePathParams } from "@app/hooks";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupTable from "@base/BoxGroupTable";
import ContainerNarrow from "@base/ContainerNarrow";
import ContainerSide from "@base/ContainerSide";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import Markdown from "@base/Markdown";
import numbro from "numbro";
import React from "react";
import styled from "styled-components";
import JobItem from "../../../jobs/components/Item/JobItem";
import { useFetchSample } from "../../queries";
import { getLibraryTypeDisplayName } from "../../utils";
import EditSample from "../EditSample";
import SampleFileSizeWarning from "./SampleFileSizeWarning";
import Sidebar from "./Sidebar";

const StyledSampleDetailGeneral = styled.div`
    align-items: stretch;
    display: flex;

    th {
        width: 220px;
    }
`;

/**
 * The general view in sample details
 */
export default function SampleDetailGeneral() {
    const { sampleId } = usePathParams<{ sampleId: string }>();

    const { data, isPending } = useFetchSample(sampleId);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const { quality } = data;

    return (
        <StyledSampleDetailGeneral>
            <ContainerNarrow>
                {!data.ready && (
                    <BoxGroup>
                        <JobItem
                            id={data.job.id}
                            workflow={data.job.workflow}
                            state={data.job?.state}
                            progress={data.job?.progress}
                            created_at={data.created_at}
                            user={data.user}
                        />
                    </BoxGroup>
                )}
                <SampleFileSizeWarning sampleId={sampleId} reads={data.reads} />
                <BoxGroup>
                    <BoxGroupHeader>
                        <h2>Metadata</h2>
                        <p>User-defined information about the sample.</p>
                    </BoxGroupHeader>
                    <BoxGroupTable>
                        <tbody>
                            <tr>
                                <th>Host</th>
                                <td>{data.host}</td>
                            </tr>
                            <tr>
                                <th>Isolate</th>
                                <td>{data.isolate}</td>
                            </tr>
                            <tr>
                                <th>Locale</th>
                                <td>{data.locale}</td>
                            </tr>
                        </tbody>
                    </BoxGroupTable>
                </BoxGroup>

                {data.ready && (
                    <BoxGroup>
                        <BoxGroupHeader>
                            <h2>Library</h2>
                            <p>
                                Information about the sequencing reads in this
                                sample.
                            </p>
                        </BoxGroupHeader>
                        <BoxGroupTable>
                            <tbody>
                                <tr>
                                    <th>Encoding</th>
                                    <td>{quality.encoding}</td>
                                </tr>
                                <tr>
                                    <th>Read Count</th>
                                    <td>
                                        {numbro(quality.count).format("0.0 a")}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Library Type</th>
                                    <td>
                                        {getLibraryTypeDisplayName(
                                            data.library_type,
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Length Range</th>
                                    <td>{quality.length.join(" - ")}</td>
                                </tr>
                                <tr>
                                    <th>GC Content</th>
                                    <td>
                                        {numbro(quality.gc / 100).format(
                                            "0.0 %",
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Paired</th>
                                    <td>{data.paired ? "Yes" : "No"}</td>
                                </tr>
                            </tbody>
                        </BoxGroupTable>
                    </BoxGroup>
                )}

                {data.ready && (
                    <BoxGroup>
                        <BoxGroupHeader>
                            <h2>Notes</h2>
                            <p>Additional notes about the sample.</p>
                        </BoxGroupHeader>
                        <Markdown markdown={data.notes} />
                    </BoxGroup>
                )}
            </ContainerNarrow>

            <ContainerSide className="pl-[15px]">
                <Sidebar
                    sampleId={data.id}
                    sampleLabels={data.labels}
                    defaultSubtractions={data.subtractions}
                />
            </ContainerSide>

            <EditSample sample={data} />
        </StyledSampleDetailGeneral>
    );
}
