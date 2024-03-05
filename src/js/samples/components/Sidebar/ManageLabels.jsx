import { map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fontWeight, getColor, getFontSize } from "../../../app/theme";
import { SidebarHeader, SideBarSection } from "../../../base";
import { useUpdateLabel } from "../../queries";
import { getPartiallySelectedLabels } from "../../selectors";
import { SampleLabelInner } from "./Labels";
import { SampleSidebarMultiselectList } from "./List";
import { SampleSidebarSelector } from "./Selector";

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

function getSelectedLabels(document) {
    const selectedLabelsCount = document.reduce((result, sample) => {
        sample.labels.forEach(({ id }) => {
            result[id] = result[id] || { ...sample.labels.find(label => label.id === id), count: 0 };
            result[id].count++;
        });
        return result;
    }, {});

    return Object.values(selectedLabelsCount).map(({ count, ...label }) => ({
        ...label,
        allLabeled: count === document.length,
    }));
}

export function ManageLabels({ labels, selectedSamples, partiallySelectedLabels }) {
    const selectedLabels = getSelectedLabels(selectedSamples);
    const onUpdateLabel = useUpdateLabel(selectedLabels, selectedSamples);

    return (
        <StyledSideBarSection>
            <SidebarHeader>
                Manage Labels
                <SampleSidebarSelector
                    render={({ name, color, description }) => (
                        <SampleLabelInner name={name} color={color} description={description} />
                    )}
                    sampleItems={labels}
                    selectedItems={map(selectedLabels, label => label.id)}
                    partiallySelectedItems={map(partiallySelectedLabels, label => label.id)}
                    onUpdate={onUpdateLabel}
                    selectionType="labels"
                    manageLink={"/samples/labels"}
                />
            </SidebarHeader>
            <SampleSidebarMultiselectList items={selectedLabels} onUpdate={onUpdateLabel} />
            {Boolean(labels.length) || (
                <SampleLabelsFooter>
                    No labels found. <Link to="/samples/labels">Create one</Link>.
                </SampleLabelsFooter>
            )}
        </StyledSideBarSection>
    );
}

export const mapStateToProps = state => ({
    partiallySelectedLabels: getPartiallySelectedLabels(state),
});

export default connect(mapStateToProps, null)(ManageLabels);
