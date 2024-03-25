import { DialogPortal } from "@radix-ui/react-dialog";
import { find } from "lodash-es";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Dialog, DialogContent, DialogFooter, DialogOverlay, DialogTitle, SaveButton } from "../../../../base";
import SegmentForm from "./Form";

const getInitialState = () => ({
    newEntry: {
        name: "",
        molecule: "",
        required: true,
        showError: false,
        nameTaken: false,
    },
});

class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = getInitialState();
    }

    handleChange = entry => {
        this.setState({
            newEntry: {
                name: entry.name,
                molecule: entry.molecule,
                required: entry.required,
            },
        });
    };

    handleSubmit = e => {
        e.preventDefault();

        const checkName = find(this.props.schema, ["name", this.state.newEntry.name]);

        if (checkName) {
            this.setState({ newEntry: { ...this.state.newEntry, nameTaken: true } });
        } else if (this.state.newEntry.name) {
            this.setState({ newEntry: { ...this.state.newEntry, nameTaken: false } });
            this.props.onSubmit([...this.props.schema, this.state.newEntry]);
        } else {
            this.setState({
                newEntry: { ...this.state.newEntry, showError: true, nameTaken: false },
            });
        }
    };

    handleHide = () => {
        this.props.onHide();
        this.setState(getInitialState());
    };

    render() {
        return (
            <Dialog open={this.props.show} onOpenChange={this.handleHide}>
                <DialogPortal>
                    <DialogOverlay />
                    <DialogContent>
                        <DialogTitle>Add Segment</DialogTitle>
                        <form onSubmit={this.handleSubmit}>
                            <SegmentForm onChange={this.handleChange} newEntry={this.state.newEntry} />
                            <DialogFooter>
                                <SaveButton />
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        );
    }
}

Add.propTypes = {
    schema: PropTypes.arrayOf(PropTypes.object),
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func,
    onSubmit: PropTypes.func,
};

const mapStateToProps = state => ({
    schema: state.otus.detail.schema ? state.otus.detail.schema : [],
});

export default connect(mapStateToProps)(Add);
