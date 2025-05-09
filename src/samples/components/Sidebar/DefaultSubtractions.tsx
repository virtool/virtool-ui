import { fontWeight, getColor, getFontSize } from "@app/theme";
import Link from "@base/Link";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import SidebarHeader from "@base/SidebarHeader";
import SideBarSection from "@base/SideBarSection";
import { useFetchSubtractionsShortlist } from "@subtraction/queries";
import { xor } from "lodash-es";
import React from "react";
import styled from "styled-components";
import SampleSidebarList from "./SampleSidebarList";
import SampleSidebarSelector from "./SampleSidebarSelector";

function SubtractionInner({ name }) {
    return name;
}

const SampleSubtractionFooter = styled.div`
    display: flex;
    color: ${(props) => getColor({ theme: props.theme, color: "greyDarkest" })};
    a {
        margin-left: 5px;
        font-size: ${getFontSize("md")};
        font-weight: ${fontWeight.thick};
    }
`;

type DefaultSubtractionsProps = {
    /** List of subtraction ids associated with the sample. */
    defaultSubtractions: string[];

    /** Callback to handle subtraction selection. */
    onUpdate: (subtractions: string[]) => void;
};

/**
 * Displays a sidebar to manage default subtractions
 */
export default function DefaultSubtractions({
    defaultSubtractions,
    onUpdate,
}: DefaultSubtractionsProps) {
    const { data: subtractionOptions, isPending } =
        useFetchSubtractionsShortlist();

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    return (
        <SideBarSection>
            <SidebarHeader>
                Default Subtractions
                <SampleSidebarSelector
                    render={({ name }) => <SubtractionInner name={name} />}
                    items={subtractionOptions}
                    selectedIds={defaultSubtractions}
                    onUpdate={(subtractionId: string) => {
                        onUpdate(xor(defaultSubtractions, [subtractionId]));
                    }}
                    selectionType="default subtractions"
                    manageLink={"/subtractions"}
                />
            </SidebarHeader>
            <SampleSidebarList
                items={subtractionOptions.filter((subtraction) =>
                    defaultSubtractions.includes(subtraction.id),
                )}
            />
            {Boolean(subtractionOptions.length) || (
                <SampleSubtractionFooter>
                    No subtractions found.{" "}
                    <Link to="/subtractions">Create one</Link>.
                </SampleSubtractionFooter>
            )}
        </SideBarSection>
    );
}
