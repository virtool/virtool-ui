import { get } from "lodash-es";
import numbro from "numbro";
import React from "react";
import { connect } from "react-redux";
import { pushState } from "../../../app/actions";
import { Icon, LoadingPlaceholder, NotFound, Table, ViewHeader, ViewHeaderIcons, ViewHeaderTitle } from "../../../base";
import { checkAdminOrPermission } from "../../../utils/utils";
import { getSubtraction } from "../../actions";
import EditSubtraction from "../Edit";
import RemoveSubtraction from "../Remove";
import SubtractionFiles from "./Files";

const calculateGC = nucleotides => numbro(1 - nucleotides.a - nucleotides.t - nucleotides.n).format("0.000");

export class SubtractionDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showEdit: false
        };
    }

    componentDidMount() {
        this.props.onGet(this.props.match.params.subtractionId);
    }

    handleHide = () => {
        this.setState({ showEdit: false });
    };

    render() {
        if (this.props.error) {
            return <NotFound />;
        }

        if (this.props.detail === null) {
            return <LoadingPlaceholder />;
        }

        const detail = this.props.detail;

        if (!detail.ready) {
            return <LoadingPlaceholder message="Subtraction is still being imported" />;
        }

        return (
            <React.Fragment>
                <ViewHeader title={detail.name}>
                    <ViewHeaderTitle>
                        {detail.name}
                        {this.props.canModify && (
                            <ViewHeaderIcons>
                                <Icon
                                    name="pencil-alt"
                                    color="orange"
                                    onClick={() => this.setState({ showEdit: true })}
                                />
                                <Icon name="trash" color="red" onClick={this.props.onShowRemove} />
                            </ViewHeaderIcons>
                        )}
                    </ViewHeaderTitle>
                </ViewHeader>
                <Table>
                    <tbody>
                        <tr>
                            <th>Nickname</th>
                            <td>{this.props.detail.nickname}</td>
                        </tr>
                        <tr>
                            <th>File</th>
                            <td>{detail.file.name || detail.file.id}</td>
                        </tr>
                        <tr>
                            <th>Sequence Count</th>
                            <td>{detail.count}</td>
                        </tr>
                        <tr>
                            <th>GC Estimate</th>
                            <td>{calculateGC(detail.gc)}</td>
                        </tr>
                        <tr>
                            <th>Linked Samples</th>
                            <td>{detail.linked_samples.length}</td>
                        </tr>
                    </tbody>
                </Table>
                <SubtractionFiles />
                <EditSubtraction show={this.state.showEdit} onHide={this.handleHide} />
                <RemoveSubtraction />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    error: get(state, "errors.GET_SUBTRACTION_ERROR"),
    canModify: checkAdminOrPermission(state, "modify_subtraction"),
    detail: state.subtraction.detail
});

const mapDispatchToProps = dispatch => ({
    onGet: subtractionId => {
        dispatch(getSubtraction(subtractionId));
    },

    onShowRemove: () => {
        dispatch(pushState({ removeSubtraction: true }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SubtractionDetail);
