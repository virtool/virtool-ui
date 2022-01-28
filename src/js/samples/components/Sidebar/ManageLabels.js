import React from "react";
import { connect } from "react-redux";
import { SidebarHeader, SideBarSection } from "../../../base";
import { SmallSampleLabel } from "../Label";
import { SampleSidebarMultiselectList } from "./List";
import { SampleSidebarSelector } from "./Selector";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFontSize, fontWeight, getColor } from "../../../app/theme";
import { map, forEach, union, reject } from "lodash-es";
import { editSample } from "../../actions";
import { getSelectedSamples, getSelectedLabels, getPartiallySelectedLabels } from "../../selectors";

const SampleLabelsFooter = styled.div`
    display: flex;
    color: ${props => getColor({ theme: props.theme, color: "greyDarkest" })};
    a {
        margin-left: 5px;
        font-size: ${getFontSize("md")};
        font-weight: ${fontWeight.thick};
    }
`;

const StyledSideBarSection = styled(SideBarSection)`
    grid-row: 2;
    align-self: start;
`;

const SampleLabelInner = ({ name, color, description }) => (
    <>
        <SmallSampleLabel color={color} name={name} />
        <p>{description}</p>
    </>
);

export const ManageLabels = ({
    allLabels,
    selectedSamples,
    selectedLabels,
    onLabelUpdate,
    partiallySelectedLabels
}) => {
    const onUpdate = label => onLabelUpdate(selectedSamples, selectedLabels, label);
    return (
        <StyledSideBarSection>
            <SidebarHeader>
                Manage Labels
                <SampleSidebarSelector
                    render={({ name, color, description }) => (
                        <SampleLabelInner name={name} color={color} description={description} />
                    )}
                    sampleItems={allLabels}
                    selectedItems={map(selectedLabels, label => label.id)}
                    partiallySelectedItems={map(partiallySelectedLabels, label => label.id)}
                    onUpdate={onUpdate}
                    selectionType="labels"
                    manageLink={"/samples/labels"}
                />
            </SidebarHeader>
            <SampleSidebarMultiselectList items={selectedLabels} onUpdate={onUpdate} />
            {Boolean(allLabels.length) || (
                <SampleLabelsFooter>
                    No labels found. <Link to="/samples/labels">Create one</Link>.
                </SampleLabelsFooter>
            )}
        </StyledSideBarSection>
    );
};

export const mapStateToProps = state => ({
    allLabels: state.labels.documents,
    selectedSamples: getSelectedSamples(state),
    selectedLabels: getSelectedLabels(state),
    partiallySelectedLabels: getPartiallySelectedLabels(state)
});

export const mapDispatchToProps = dispatch => ({
    onLabelUpdate: (selectedSamples, selectedLabels, label) => {
        forEach(selectedSamples, sample => {
            const sampleLabelIds = map(sample.labels, label => label.id);
            if (!selectedLabels[label] || !selectedLabels[label].allLabeled) {
                dispatch(editSample(sample.id, { labels: union(sampleLabelIds, [label]) }));
            } else {
                dispatch(editSample(sample.id, { labels: reject(sampleLabelIds, id => label === id) }));
            }
        });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageLabels);
