import { get, map, sortBy } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { pushState } from "../../app/actions";
import {
    BoxGroup,
    ContainerNarrow,
    LoadingPlaceholder,
    NoneFoundSection,
    ViewHeader,
    ViewHeaderSubtitle,
    ViewHeaderTitle
} from "../../base";
import { routerLocationHasState } from "../../utils/utils";
import { useFetchLabels } from "../hooks";
import { CreateLabel } from "./Create";
import { Item } from "./Item";

const LabelsHeader = styled(ViewHeader)`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

type LabelsProps = {
    labels: any;
    showCreate: boolean;
    onHide: () => void;
    onLoadLabels: () => void;
};

function Labels({ showCreate, onHide }: LabelsProps) {
    const { data, isLoading } = useFetchLabels();

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    return (
        <ContainerNarrow>
            <LabelsHeader title="Labels">
                <div>
                    <ViewHeaderTitle>Labels</ViewHeaderTitle>
                    <ViewHeaderSubtitle>Use labels to organize samples.</ViewHeaderSubtitle>
                </div>

                <CreateLabel />
            </LabelsHeader>

            <BoxGroup>
                {data.length ? (
                    map(sortBy(data, "name"), label => (
                        <Item
                            key={label.id}
                            name={label.name}
                            color={label.color}
                            description={label.description}
                            id={label.id}
                        />
                    ))
                ) : (
                    <NoneFoundSection noun="labels" />
                )}
            </BoxGroup>
        </ContainerNarrow>
    );
}

function mapStateToProps(state) {
    return {
        showCreate: routerLocationHasState(state, "createLabel"),
        error: get(state, "errors.UPDATE_SAMPLE_ERROR.message", "")
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onHide: () => {
            dispatch(pushState({ createLabel: false, removeLabel: false }));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Labels);
