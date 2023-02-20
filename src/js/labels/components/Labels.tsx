import { get, map, sortBy } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { pushState } from "../../app/actions";
import {
    BoxGroup,
    BoxGroupHeader,
    LoadingPlaceholder,
    ContainerNarrow,
    NoneFoundSection,
    ViewHeader,
    ViewHeaderTitle
} from "../../base";
import { routerLocationHasState } from "../../utils/utils";
import { listLabels } from "../actions";
import { getLabels } from "../selectors";
import CreateLabel from "./Create";
import EditLabel from "./Edit";
import { Item } from "./Item";
import RemoveLabel from "./Remove";

const LabelsHeader = styled(BoxGroupHeader)`
    h2 {
        align-items: center;
        display: flex;

        justify-content: space-between;
    }
`;

type LabelsProps = {
    onLoadLabels: () => void;
    labels: any;
    onRemove: () => void;
    onEdit: () => void;
};

function Labels({ labels, onEdit, onLoadLabels, onRemove }: LabelsProps) {
    useEffect(() => {
        onLoadLabels();
    }, []);

    if (labels === null) {
        return <LoadingPlaceholder />;
    }

    let labelComponents;

    if (labels.length) {
        labelComponents = map(sortBy(labels, "name"), label => (
            <Item
                key={label.id}
                name={label.name}
                color={label.color}
                description={label.description}
                id={label.id}
                removeLabel={onRemove}
                editLabel={onEdit}
            />
        ));
    } else {
        labelComponents = <NoneFoundSection noun="labels" />;
    }

    return (
        <ContainerNarrow>
            <ViewHeader title="Labels">
                <ViewHeaderTitle>Labels</ViewHeaderTitle>
            </ViewHeader>
            <BoxGroup>
                <LabelsHeader>
                    <h2>
                        Labels
                        <Link color="blue" to={{ state: { createLabel: true } }}>
                            Create Label
                        </Link>
                    </h2>
                    <p>Labels can help organize samples.</p>
                </LabelsHeader>
                {labelComponents}
            </BoxGroup>
            <CreateLabel />
            <EditLabel />
            <RemoveLabel />
        </ContainerNarrow>
    );
}

function mapStateToProps(state) {
    return {
        show: routerLocationHasState(state, "removeLabel"),
        labels: getLabels(state),
        error: get(state, "errors.UPDATE_SAMPLE_ERROR.message", "")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onLoadLabels: () => {
            dispatch(listLabels());
        },

        onHide: () => {
            dispatch(pushState({ removeLabel: false }));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Labels);
