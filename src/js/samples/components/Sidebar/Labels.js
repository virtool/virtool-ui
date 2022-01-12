import React from "react";
import { connect } from "react-redux";
import { SidebarHeader, SideBarSection } from "../../../base";
import { SmallSampleLabel } from "../Label";
import { SampleSidebarList } from "./List";
import { SampleSidebarSelector } from "./Selector";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFontSize, fontWeight, getColor } from "../../../app/theme";

const SampleLabelInner = ({ name, color, description }) => (
    <>
        <SmallSampleLabel color={color} name={name} />
        <p>{description}</p>
    </>
);

const SampleLabelsFooter = styled.div`
    display: flex;
    color: ${props => getColor({ theme: props.theme, color: "greyDarkest" })};
    a {
        margin-left: 5px;
        font-size: ${getFontSize("md")};
        font-weight: ${fontWeight.thick};
    }
`;

export const SampleLabels = ({ allLabels, sampleLabels, onUpdate }) => (
    <SideBarSection>
        <SidebarHeader>
            Labels
            <SampleSidebarSelector
                render={({ name, color, description }) => (
                    <SampleLabelInner name={name} color={color} description={description} />
                )}
                sampleItems={allLabels}
                selectedItems={sampleLabels}
                onUpdate={onUpdate}
                selectionType="labels"
                manageLink={"/samples/labels"}
            />
        </SidebarHeader>
        <SampleSidebarList items={allLabels.filter(item => sampleLabels.includes(item.id))} />
        {Boolean(allLabels.length) || (
            <SampleLabelsFooter>
                No labels found. <Link to="/samples/labels">Create one</Link>.
            </SampleLabelsFooter>
        )}
    </SideBarSection>
);

export const mapStateToProps = state => ({
    allLabels: state.labels.documents
});

export default connect(mapStateToProps)(SampleLabels);
