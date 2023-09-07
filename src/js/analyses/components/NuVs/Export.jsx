/**
 * @copyright 2017 Government of Canada
 * @license MIT
 * @author igboyes
 *
 */
import { forEach, map, reduce, replace } from "lodash-es";
import React from "react";

import { connect } from "react-redux";
import { pushState } from "../../../app/actions";
import { Button, ButtonGroup, Modal, ModalBody, ModalFooter, ModalHeader } from "../../../base/";
import { followDynamicDownload, routerLocationHasState } from "../../../utils/utils";
import { getResults } from "../../selectors";
import NuVsExportPreview from "./ExportPreview";

const getInitialState = () => ({
    mode: "contigs",
    evalue: false,
    orfs: false,
    pos: false,
    family: false,
});

const getBestHit = items =>
    reduce(
        items,
        (best, hit) => {
            if (hit.full_e < best.e) {
                best.e = hit.full_e;
                best.name = hit.names[0];
            }

            return best;
        },
        { name: null, e: 10 },
    );

const exportContigData = (hits, sampleName) =>
    map(hits, result => {
        const orfNames = reduce(
            result.orfs,
            (names, orf) => {
                // Get the best hit for the current ORF.
                if (orf.hits.length) {
                    const bestHit = getBestHit(orf.hits);

                    if (bestHit.name) {
                        names.push(bestHit.name);
                    }
                }

                return names;
            },
            [],
        );
        return `>sequence_${result.index}|${sampleName}|${orfNames.join("|")}\n${result.sequence}`;
    });

const exportORFData = (hits, sampleName) =>
    reduce(
        hits,
        (lines, result) => {
            forEach(result.orfs, orf => {
                // Get the best hit for the current ORF.
                if (orf.hits.length) {
                    const bestHit = getBestHit(orf.hits);

                    if (bestHit.name) {
                        lines.push(`>orf_${result.index}_${orf.index}|${sampleName}|${bestHit.name}\n${orf.pro}`);
                    }
                }
            });

            return lines;
        },
        [],
    );

const downloadData = (analysisId, content, sampleName, suffix) =>
    followDynamicDownload(`nuvs.${replace(sampleName, " ", "_")}.${analysisId}.${suffix}.fa`, content.join("\n"));

export class NuVsExport extends React.Component {
    constructor(props) {
        super(props);
        this.state = getInitialState();
    }

    handleModalExited = () => {
        this.setState(getInitialState());
    };

    setMode = mode => {
        this.setState({ ...getInitialState(), mode });
    };

    handleSubmit = e => {
        e.preventDefault();

        const {
            sampleName,
            analysisId,
            results: { hits },
        } = this.props;

        let content;
        let suffix;

        if (this.state.mode === "contigs") {
            content = exportContigData(hits, sampleName);
            suffix = "contigs";
        } else {
            content = exportORFData(hits, sampleName);
            suffix = "orfs";
        }

        downloadData(analysisId, content, sampleName, suffix);
    };

    render() {
        return (
            <Modal
                label="Export Analysis"
                show={this.props.show}
                onHide={this.props.onHide}
                onExited={this.handleModalExited}
            >
                <ModalHeader>Export Analysis</ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <ButtonGroup>
                            <Button
                                type="button"
                                active={this.state.mode === "contigs"}
                                onClick={() => this.setMode("contigs")}
                            >
                                Contigs
                            </Button>
                            <Button
                                type="button"
                                active={this.state.mode === "orfs"}
                                onClick={() => this.setMode("orfs")}
                            >
                                ORFs
                            </Button>
                        </ButtonGroup>

                        <NuVsExportPreview mode={this.state.mode} />
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" color="blueDark" icon="download">
                            Download
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    results: getResults(state),
    show: routerLocationHasState(state, "export"),
    sampleName: state.samples.detail.name,
    analysisId: state.analyses.detail.id,
});

const mapDispatchToProps = dispatch => ({
    onHide: () => {
        dispatch(pushState({ export: false }));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(NuVsExport);
