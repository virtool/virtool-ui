import { xor } from "lodash-es";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fontWeight, getColor, getFontSize } from "../../../app/theme";
import { LoadingPlaceholder, SidebarHeader, SideBarSection } from "../../../base";
import { useFetchSubtractionsShortlist } from "../../../subtraction/querys";
import { SampleSidebarList } from "./List";
import { SampleSidebarSelector } from "./Selector";

const SubtractionInner = ({ name }) => name;

const SampleSubtractionFooter = styled.div`
    display: flex;
    color: ${props => getColor({ theme: props.theme, color: "greyDarkest" })};
    a {
        margin-left: 5px;
        font-size: ${getFontSize("md")};
        font-weight: ${fontWeight.thick};
    }
`;

export default function DefaultSubtractions({ defaultSubtractions, onUpdate }) {
    const { data: subtractionOptions, isLoading } = useFetchSubtractionsShortlist();

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    return (
        <SideBarSection>
            <SidebarHeader>
                Default Subtractions
                <SampleSidebarSelector
                    render={({ name }) => <SubtractionInner name={name} />}
                    sampleItems={subtractionOptions}
                    selectedItems={defaultSubtractions}
                    onUpdate={subtractionId => {
                        onUpdate(xor(defaultSubtractions, [subtractionId]));
                    }}
                    selectionType="default subtractions"
                    manageLink={"/subtractions"}
                />
            </SidebarHeader>
            <SampleSidebarList
                items={subtractionOptions.filter(subtraction => defaultSubtractions.includes(subtraction.id))}
            />
            {Boolean(subtractionOptions.length) || (
                <SampleSubtractionFooter>
                    No subtractions found. <Link to="/subtractions">Create one</Link>.
                </SampleSubtractionFooter>
            )}
        </SideBarSection>
    );
}
