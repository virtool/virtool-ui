import { DialogPortal } from "@radix-ui/react-dialog";
import { find, map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../../base";
import { editReferenceGroup, editReferenceUser } from "../../actions";
import { MemberRight } from "./MemberRight";

const getInitialState = () => ({
    build: false,
    modify: false,
    modify_otu: false,
    remove: false,
});

const rights = ["modify_otu", "build", "modify", "remove"];

export class EditReferenceMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = getInitialState();
    }

    handleChange = (key, enabled) => {
        const { modify_otu, build, modify, remove } = this.props;

        const update = {
            modify_otu,
            build,
            modify,
            remove,
            [key]: enabled,
        };

        this.props.onEdit(this.props.refId, this.props.show, update);
    };

    handleEnter = () => {
        const { build, modify, modify_otu, remove } = this.props;
        this.setState({
            build,
            modify,
            modify_otu,
            remove,
        });
    };

    handleHide = () => {
        this.setState(getInitialState());
        this.props.onHide();
    };

    render() {
        const rightComponents = map(rights, right => (
            <MemberRight key={right} right={right} enabled={this.props[right]} onToggle={this.handleChange} />
        ));

        const title = `Modify Rights for ${this.props.handle || this.props.name}`;

        return (
            <Dialog open={Boolean(this.props.show)} onOpenChange={this.handleHide}>
                <DialogPortal>
                    <DialogOverlay />
                    <DialogContent>
                        <DialogTitle>{title}</DialogTitle>
                        {rightComponents}
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const noun = ownProps.noun;
    const members = noun === "user" ? state.references.detail.users : state.references.detail.groups;
    return {
        refId: state.references.detail.id,
        ...find(members, { id: ownProps.show }),
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    onEdit: (refId, id, update) => {
        const actionCreator = ownProps.noun === "user" ? editReferenceUser : editReferenceGroup;
        dispatch(actionCreator(refId, id, update));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditReferenceMember);
