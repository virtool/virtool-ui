import { get, map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getBorder } from "../../app/theme";

import {
    device,
    Badge,
    BoxGroup,
    BoxGroupHeader,
    Label,
    LoadingPlaceholder,
    NotFound,
    Table,
    ViewHeader,
    ViewHeaderTitle
} from "../../base";
import { getHmm } from "../actions";
import { ClusterMember } from "./ClusterMember";
import { HMMTaxonomy } from "./Taxonomy";

const ClusterTable = styled(Table)`
    border: none;
    display: flex;
    flex-flow: column;
    height: 330px !important;
    margin: 0;
    width: 100%;

    thead {
        flex: 0 0 auto;
        width: calc(100% - 0.9em);

        th {
            border-bottom: none;
        }
    }

    tbody {
        flex: 1 1 auto;
        display: block;
        overflow-y: auto;
        border-top: ${getBorder};

        tr {
            width: 100%;
        }

        tr:first-child td {
            border-top: none;
        }
    }

    thead,
    tbody tr {
        display: table;
        table-layout: fixed;
    }
`;

const TaxonomyGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: ${props => props.theme.gap.column};

    @media (max-width: ${device.tablet}) {
        grid-template-columns: 1fr;
    }
`;

export class HMMDetail extends React.Component {
    componentDidMount() {
        this.props.onGet(this.props.match.params.hmmId);
    }

    render() {
        if (this.props.error) {
            return <NotFound />;
        }

        if (this.props.detail === null) {
            return <LoadingPlaceholder margin="130px" />;
        }
        const clusterMembers = map(this.props.detail.entries, ({ name, accession, organism }, index) => (
            <ClusterMember name={name} accession={accession} organism={organism} key={index} />
        ));

        const names = map(this.props.detail.names, (name, index) => (
            <Label key={index} spaced>
                {name}
            </Label>
        ));

        const title = this.props.detail.names[0];

        return (
            <div>
                <ViewHeader title={title}>
                    <ViewHeaderTitle>{title}</ViewHeaderTitle>
                </ViewHeader>

                <BoxGroup>
                    <BoxGroupHeader>
                        <h2>General</h2>
                    </BoxGroupHeader>

                    <Table>
                        <tbody>
                            <tr>
                                <th>Cluster</th>
                                <td>{this.props.detail.cluster}</td>
                            </tr>

                            <tr>
                                <th>Best Definitions</th>
                                <td>{names}</td>
                            </tr>

                            <tr>
                                <th>Length</th>
                                <td>{this.props.detail.length}</td>
                            </tr>

                            <tr>
                                <th>Mean Entropy</th>
                                <td>{this.props.detail.mean_entropy}</td>
                            </tr>

                            <tr>
                                <th>Total Entropy</th>
                                <td>{this.props.detail.total_entropy}</td>
                            </tr>
                        </tbody>
                    </Table>
                </BoxGroup>

                <BoxGroup>
                    <BoxGroupHeader>
                        <h2>
                            Cluster Members <Badge>{this.props.detail.entries.length}</Badge>
                        </h2>
                    </BoxGroupHeader>
                    <ClusterTable>
                        <thead>
                            <tr>
                                <th>Accession</th>
                                <th>Name</th>
                                <th>Organism</th>
                            </tr>
                        </thead>
                        <tbody>{clusterMembers}</tbody>
                    </ClusterTable>
                </BoxGroup>

                <TaxonomyGrid>
                    <HMMTaxonomy title="Families" counts={this.props.detail.families} />
                    <HMMTaxonomy title="Genera" counts={this.props.detail.genera} />
                </TaxonomyGrid>
            </div>
        );
    }
}

export const mapStateToProps = state => ({
    error: get(state, "errors.GET_HMM_ERROR", null),
    detail: state.hmms.detail
});

export const mapDispatchToProps = dispatch => ({
    onGet: hmmId => {
        dispatch(getHmm(hmmId));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(HMMDetail);
