import { DialogPortal } from "@radix-ui/react-dialog";
import { get } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { pushState } from "../../app/actions";
import { Button, Dialog, DialogContent, DialogFooter, DialogOverlay, DialogTitle } from "../../base";
import { clearError } from "../../errors/actions";
import { routerLocationHasState } from "../../utils/utils";
import { createIndex, getUnbuilt } from "../actions";
import RebuildHistory from "./History";
import { RebuildIndexError } from "./RebuildError";

class RebuildIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: "" };
    }

    componentDidMount() {
        this.props.onGetUnbuilt(this.props.refId);
    }

    handleHide = () => {
        this.props.onHide();
        this.setState({ error: "" });
        if (this.props.error) {
            this.props.onClearError();
        }
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.onRebuild(this.props.refId);
    };

    render() {
        const error = this.state.error || this.props.error;

        return (
            <Dialog open={this.props.show} size="lg" onOpenChange={this.handleHide}>
                <DialogPortal>
                    <DialogOverlay />
                    <DialogContent>
                        <DialogTitle>Rebuild Index</DialogTitle>
                        <form onSubmit={this.handleSubmit}>
                            <RebuildIndexError error={error} />
                            <RebuildHistory unbuilt={this.props.unbuilt} error={this.state.error} />
                            <DialogFooter>
                                <Button type="submit" color="blue" icon="wrench">
                                    Start
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        );
    }
}

const mapStateToProps = state => ({
    show: routerLocationHasState(state, "rebuild", true),
    unbuilt: state.indexes.unbuilt,
    error: get(state, "errors.CREATE_INDEX_ERROR.message", ""),
    refId: state.references.detail.id,
});

const mapDispatchToProps = dispatch => ({
    onGetUnbuilt: refId => {
        dispatch(getUnbuilt(refId));
    },

    onRebuild: refId => {
        dispatch(createIndex(refId));
    },

    onHide: () => {
        dispatch(pushState({ rebuild: false }));
    },

    onClearError: () => {
        dispatch(clearError("CREATE_INDEX_ERROR"));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(RebuildIndex);
