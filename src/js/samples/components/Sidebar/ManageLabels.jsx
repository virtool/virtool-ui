import { map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fontWeight, getColor, getFontSize } from "../../../app/theme";
import { LoadingPlaceholder, SidebarHeader, SideBarSection } from "../../../base";
import { useFetchLabels } from "../../../labels/hooks";
import { useUpdateLabel } from "../../querys";
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

export function ManageLabels({ selectedSamples, partiallySelectedLabels, documents }) {
    const { data: allLabels, isLoading } = useFetchLabels();

    const document = documents.filter(documentItem =>
        selectedSamples.some(selectedItem => selectedItem.id === documentItem.id),
    );

    const selectedLabels = getSelectedLabels();
    const onUpdateLabel = useUpdateLabel(selectedLabels, document);

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    function getSelectedLabels() {
        if (!document || !Array.isArray(document)) {
            return [];
        }
        const selectedLabelsCount = document.reduce((result, sample) => {
            sample.labels.forEach(label => {
                if (result[label.id]) {
                    result[label.id].count++;
                } else {
                    result[label.id] = { ...label, count: 1 };
                }
            });
            return result;
        }, {});

        return Object.values(selectedLabelsCount).map(label => {
            label.allLabeled = label.count === document.length;
            delete label.count;
            return label;
        });
    }

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
                    onUpdate={onUpdateLabel}
                    selectionType="labels"
                    manageLink={"/samples/labels"}
                />
            </SidebarHeader>
            <SampleSidebarMultiselectList items={selectedLabels} onUpdate={onUpdateLabel} />
            {Boolean(allLabels.length) || (
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
