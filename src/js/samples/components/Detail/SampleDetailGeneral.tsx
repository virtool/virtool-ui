import numbro from "numbro";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import {
    BoxGroup,
    BoxGroupHeader,
    ContainerNarrow,
    ContainerSide,
    Markdown,
    Table,
} from "../../../base";
import { LibraryType, Sample } from "../../types";
import { getLibraryTypeDisplayName } from "../../utils";
import EditSample from "../EditSample";
import SampleFileSizeWarning from "./FileSizeWarning";
import Sidebar from "./Sidebar";

const SampleDetailSidebarContainer = styled(ContainerSide)`
    padding-left: 15px;
`;

const StyledSampleDetailGeneral = styled.div`
    align-items: stretch;
    display: flex;

    th {
        width: 220px;
    }
`;

type SampleDetailGeneralProps = {
    /** The read count of the sample */
    count: string;
    encoding: string;
    /** The GC content of the sample (percentage) */
    gc: string;
    lengthRange: string;
    libraryType: LibraryType;
    /** The sample data */
    sample: Sample;
};

/**
 * The general view in sample details
 */
export function SampleDetailGeneral({
    count,
    encoding,
    gc,
    lengthRange,
    libraryType,
    sample,
}: SampleDetailGeneralProps) {
    const { name, host, isolate, locale, paired, notes } = sample;
    const history = useHistory<{ editSample: boolean }>();

    return (
        <StyledSampleDetailGeneral>
            <ContainerNarrow>
                <SampleFileSizeWarning />
                <BoxGroup>
                    <BoxGroupHeader>
                        <h2>General</h2>
                        <p>User-defined information about the sample.</p>
                    </BoxGroupHeader>
                    <Table>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <td>{name}</td>
                            </tr>
                            <tr>
                                <th>Host</th>
                                <td>{host}</td>
                            </tr>
                            <tr>
                                <th>Isolate</th>
                                <td>{isolate}</td>
                            </tr>
                            <tr>
                                <th>Locale</th>
                                <td>{locale}</td>
                            </tr>
                        </tbody>
                    </Table>
                </BoxGroup>

                <BoxGroup>
                    <BoxGroupHeader>
                        <h2>Library</h2>
                        <p>
                            Information about the sequencing reads in this
                            sample.
                        </p>
                    </BoxGroupHeader>
                    <Table>
                        <tbody>
                            <tr>
                                <th>Encoding</th>
                                <td>{encoding}</td>
                            </tr>
                            <tr>
                                <th>Read Count</th>
                                <td>{count}</td>
                            </tr>
                            <tr>
                                <th>Library Type</th>
                                <td>{libraryType}</td>
                            </tr>
                            <tr>
                                <th>Length Range</th>
                                <td>{lengthRange}</td>
                            </tr>
                            <tr>
                                <th>GC Content</th>
                                <td>{gc}</td>
                            </tr>
                            <tr>
                                <th>Paired</th>
                                <td>{paired ? "Yes" : "No"}</td>
                            </tr>
                        </tbody>
                    </Table>
                </BoxGroup>

                <BoxGroup>
                    <BoxGroupHeader>
                        <h2>Notes</h2>
                        <p>Additional notes about the sample.</p>
                    </BoxGroupHeader>
                    <Markdown markdown={notes} />
                </BoxGroup>
            </ContainerNarrow>

            <SampleDetailSidebarContainer>
                <Sidebar
                    sampleId={sample.id}
                    sampleLabels={sample.labels}
                    defaultSubtractions={sample.subtractions}
                />
            </SampleDetailSidebarContainer>

            <EditSample
                sample={sample}
                show={history.location.state?.editSample}
                onHide={() => history.push({ state: { editSample: false } })}
            />
        </StyledSampleDetailGeneral>
    );
}

export const mapStateToProps = state => {
    const { quality, library_type } = state.samples.detail;
    const { count, encoding, gc, length } = quality;

    return {
        encoding,
        count: numbro(count).format("0.0 a"),
        gc: numbro(gc / 100).format("0.0 %"),
        libraryType: getLibraryTypeDisplayName(library_type),
        lengthRange: length.join(" - "),
        sample: state.samples.detail,
    };
};

export default connect(mapStateToProps)(SampleDetailGeneral);
