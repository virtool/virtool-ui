import React from "react";
import { connect } from "react-redux";
import { checkAdminRoleOrPermission } from "../../administration/utils";
import { Badge, LegacyScrollList, LoadingPlaceholder, NoneFoundBox, ViewHeader, ViewHeaderTitle } from "../../base";
import { findSubtractions } from "../actions";
import SubtractionItem from "./Item";
import SubtractionToolbar from "./Toolbar";

export class SubtractionList extends React.Component {
    componentDidMount() {
        if (!this.props.fetched) {
            this.props.onLoadNextPage(this.props.term, 1);
        }
    }

    renderRow = index => <SubtractionItem key={index} index={index} />;

    render() {
        let subtractionComponents;
        if (this.props.documents === null) {
            return <LoadingPlaceholder />;
        }

        if (this.props.documents.length) {
            subtractionComponents = (
                <LegacyScrollList
                    documents={this.props.documents}
                    onLoadNextPage={page => this.props.onLoadNextPage(this.props.term, page)}
                    page={this.props.page}
                    pageCount={this.props.page_count}
                    renderRow={this.renderRow}
                />
            );
        } else {
            subtractionComponents = <NoneFoundBox noun="subtractions" />;
        }

        return (
            <>
                <ViewHeader title="Subtractions">
                    <ViewHeaderTitle>
                        Subtractions <Badge>{this.props.total_count}</Badge>
                    </ViewHeaderTitle>
                </ViewHeader>

                <SubtractionToolbar />

                {subtractionComponents}
            </>
        );
    }
}

const mapStateToProps = state => ({
    ...state.subtraction,
    canModify: checkAdminRoleOrPermission(state, "modify_subtraction"),
});

const mapDispatchToProps = dispatch => ({
    onLoadNextPage: (term, page) => {
        dispatch(findSubtractions(term, page));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SubtractionList);
