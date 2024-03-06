import { xor } from "lodash-es";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fontWeight, getColor, getFontSize } from "../../../app/theme";
import { LoadingPlaceholder, SidebarHeader, SideBarSection } from "../../../base";
import { useFetchLabels } from "../../../labels/queries";
import { SmallSampleLabel } from "../Label/SmallSampleLabel";
import { SampleSidebarList } from "./List";
import { SampleSidebarSelector } from "./Selector";

export const SampleLabelInner = ({ name, color, description }) => (
    <div>
        <SmallSampleLabel color={color} name={name} />
        <StyledParagraph>{description}</StyledParagraph>
    </div>
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

const StyledParagraph = styled.div`
    color: ${props => getColor({ theme: props.theme, color: "greyDarkest" })};
    font-size: ${getFontSize("sm")};
`;

export default function SampleLabels({ sampleLabels, onUpdate }) {
    const { data, isLoading } = useFetchLabels();

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    return (
        <SideBarSection>
            <SidebarHeader>
                Labels
                <SampleSidebarSelector
                    render={({ name, color, description }) => (
                        <SampleLabelInner name={name} color={color} description={description} />
                    )}
                    sampleItems={data}
                    selectedItems={sampleLabels}
                    onUpdate={labelId => {
                        onUpdate(xor(sampleLabels, [labelId]));
                    }}
                    selectionType="labels"
                    manageLink={"/samples/labels"}
                />
            </SidebarHeader>
            <SampleSidebarList items={data.filter(item => sampleLabels.includes(item.id))} />
            {Boolean(data.length) || (
                <SampleLabelsFooter>
                    No labels found. <Link to="/samples/labels">Create one</Link>.
                </SampleLabelsFooter>
            )}
        </SideBarSection>
    );
}
