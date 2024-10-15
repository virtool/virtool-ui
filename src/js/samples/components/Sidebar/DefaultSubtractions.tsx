import { fontWeight, getColor, getFontSize } from "@app/theme";
import { Link, LoadingPlaceholder, SidebarHeader, SideBarSection } from "@base";
import SampleSidebarList from "@samples/components/Sidebar/SampleSidebarList";
import { useFetchSubtractionsShortlist } from "@subtraction/queries";
import { xor } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { SampleSidebarSelector } from "./SampleSidebarSelector";

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

type DefaultSubtractionsProps = {
    /** List of subtraction ids associated with the sample */
    defaultSubtractions: string[];
    /** Callback function to handle subtraction selection */
    onUpdate: (subtractions: string[]) => void;
};

/**
 * Displays a sidebar to manage default subtractions
 */
export default function DefaultSubtractions({ defaultSubtractions, onUpdate }: DefaultSubtractionsProps) {
    const { data: subtractionOptions, isPending } = useFetchSubtractionsShortlist();

    if (isPending) {
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
