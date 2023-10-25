import { find, includes, map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { getAccountId } from "../../../account/selectors";

import {
    Box,
    BoxGroup,
    BoxGroupHeader,
    BoxGroupSection,
    ContainerNarrow,
    InputGroup,
    InputLabel,
    InputSelect,
    LoadingPlaceholder,
} from "../../../base";
import { listGroups } from "../../../groups/actions";
import { updateSampleRights } from "../../actions";
import { getCanModifyRights } from "../../selectors";

export class SampleRights extends React.Component {
    componentDidMount() {
        this.props.onListGroups();
    }

    handleChangeGroup = e => {
        this.props.onChangeGroup(this.props.sampleId, e.target.value);
    };

    handleChangeRights = (e, scope) => {
        this.props.onChangeRights(this.props.sampleId, scope, e.target.value);
    };

    render() {
        if (this.props.groups === null) {
            return <LoadingPlaceholder />;
        }

        if (!this.props.canModifyRights) {
            return <Box>Not allowed</Box>;
        }

        const groupRights = (this.props.group_read ? "r" : "") + (this.props.group_write ? "w" : "");
        const allRights = (this.props.all_read ? "r" : "") + (this.props.all_write ? "w" : "");

        const groupOptionComponents = map(this.props.groups, group => (
            <option key={group.id} value={group.id}>
                {group.name}
            </option>
        ));

        const selectedGroup =
            typeof this.props.group === "number"
                ? this.props.group
                : find(
                      this.props.groups,
                      group => this.props.group === group.legacy_id || this.props.group === group.id,
                  )?.id;

        return (
            <ContainerNarrow>
                <BoxGroup>
                    <BoxGroupHeader>
                        <h2>Sample Rights</h2>
                        <p>Control who can read and write this sample and which user group owns the sample.</p>
                    </BoxGroupHeader>
                    <BoxGroupSection>
                        <InputGroup>
                            <InputLabel>Group</InputLabel>
                            <InputSelect value={selectedGroup} onChange={this.handleChangeGroup}>
                                <option value="none">None</option>
                                {groupOptionComponents}
                            </InputSelect>
                        </InputGroup>

                        <InputGroup>
                            <InputLabel>Group Rights</InputLabel>
                            <InputSelect
                                name="groupRights"
                                value={groupRights}
                                onChange={e => this.handleChangeRights(e, "group")}
                            >
                                <option value="">None</option>
                                <option value="r">Read</option>
                                <option value="rw">Read & write</option>
                            </InputSelect>
                        </InputGroup>

                        <InputGroup>
                            <InputLabel>All Users' Rights</InputLabel>
                            <InputSelect
                                name="allUsers"
                                label="All Users' Rights"
                                value={allRights}
                                onChange={e => this.handleChangeRights(e, "all")}
                            >
                                <option value="">None</option>
                                <option value="r">Read</option>
                                <option value="rw">Read & write</option>
                            </InputSelect>
                        </InputGroup>
                    </BoxGroupSection>
                </BoxGroup>
            </ContainerNarrow>
        );
    }
}

export function mapStateToProps(state) {
    const { all_read, all_write, group, group_read, group_write, id, user } = state.samples.detail;

    return {
        canModifyRights: getCanModifyRights(state),
        accountId: getAccountId(state),
        groups: state.groups.documents,
        ownerId: user.id,
        sampleId: id,
        group,
        group_read,
        group_write,
        all_read,
        all_write,
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        onListGroups: () => {
            dispatch(listGroups());
        },

        onChangeGroup: (sampleId, groupId) => {
            dispatch(updateSampleRights(sampleId, { group: groupId }));
        },

        onChangeRights: (sampleId, scope, value) => {
            const update = {
                [`${scope}_read`]: includes(value, "r"),
                [`${scope}_write`]: includes(value, "w"),
            };

            dispatch(updateSampleRights(sampleId, update));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SampleRights);
