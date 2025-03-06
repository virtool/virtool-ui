import { fontWeight, getColor, getFontSize } from "@app/theme";
import { Link, LoadingPlaceholder, SidebarHeader, SideBarSection } from "@/base";
import { useFetchLabels } from "@labels/queries";
import SampleLabelInner from "@samples/components/Sidebar/SampleLabelInner";
import SampleSidebarList from "@samples/components/Sidebar/SampleSidebarList";
import { xor } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { SampleSidebarSelector } from "./SampleSidebarSelector";

const SampleLabelsFooter = styled.div`
    display: flex;
    color: ${(props) => getColor({ theme: props.theme, color: "greyDarkest" })};
    a {
        margin-left: 5px;
        font-size: ${getFontSize("md")};
        font-weight: ${fontWeight.thick};
    }
`;

type SampleLabelsProps = {
    /** List of label ids associated with the sample */
    sampleLabels: number[];
    /** Callback function to handle label selection */
    onUpdate: (labels: number[]) => void;
};

/**
 * Displays a sidebar to manage sample labels
 */
export default function SampleLabels({
    sampleLabels,
    onUpdate,
}: SampleLabelsProps) {
    const { data, isPending } = useFetchLabels();

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    return (
        <SideBarSection>
            <SidebarHeader>
                Labels
                <SampleSidebarSelector
                    render={({ name, color, description }) => (
                        <SampleLabelInner
                            name={name}
                            color={color}
                            description={description}
                        />
                    )}
                    sampleItems={data}
                    selectedItems={sampleLabels}
                    onUpdate={(labelId: number) => {
                        onUpdate(xor(sampleLabels, [labelId]));
                    }}
                    selectionType="labels"
                    manageLink={"/samples/labels"}
                />
            </SidebarHeader>
            <SampleSidebarList
                items={data.filter((item) => sampleLabels.includes(item.id))}
            />
            {Boolean(data.length) || (
                <SampleLabelsFooter>
                    No labels found.{" "}
                    <Link to="/samples/labels">Create one</Link>.
                </SampleLabelsFooter>
            )}
        </SideBarSection>
    );
}
