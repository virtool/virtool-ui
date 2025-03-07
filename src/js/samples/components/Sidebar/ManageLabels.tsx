import { fontWeight, getColor, getFontSize } from "@app/theme";
import Link from "@base/Link";
import SidebarHeader from "@base/SidebarHeader";
import SideBarSection from "@base/SideBarSection";
import { Label } from "@labels/types";
import SampleLabelInner from "@samples/components/Sidebar/SampleLabelInner";
import { SampleMinimal } from "@samples/types";
import { filter, flatMap, groupBy, map } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { useUpdateLabel } from "../../queries";
import SampleSidebarMultiselectList from "./SampleSidebarMultiselectList";
import SampleSidebarSelector from "./SampleSidebarSelector";

const SampleLabelsFooter = styled.div`
    display: flex;
    color: ${(props) => getColor({ theme: props.theme, color: "greyDarkest" })};

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

function getSelectedLabels(document: SampleMinimal[]) {
    const selectedLabelsCount = map(
        groupBy(flatMap(document, "labels"), "id"),
        (labels) => ({
            ...labels[0],
            count: labels.length,
        }),
    );

    return map(selectedLabelsCount, ({ count, ...label }) => ({
        ...label,
        allLabeled: count === document.length,
    }));
}

type ManageLabelsProps = {
    labels: Label[];
    selectedSamples: SampleMinimal[];
};

/**
 * A sidebar to manage labels and filtering samples by labels
 */
export default function ManageLabels({
    labels,
    selectedSamples,
}: ManageLabelsProps) {
    const selectedLabels = getSelectedLabels(selectedSamples);
    const partiallySelectedLabels = filter(selectedLabels, {
        allLabeled: false,
    });
    const onUpdateLabel = useUpdateLabel(selectedLabels, selectedSamples);

    return (
        <StyledSideBarSection>
            <SidebarHeader>
                Manage Labels
                <SampleSidebarSelector
                    items={labels}
                    manageLink={"/samples/labels"}
                    onUpdate={onUpdateLabel}
                    partiallySelectedItems={map(
                        partiallySelectedLabels,
                        (label: Label) => label.id,
                    )}
                    selectedIds={map(
                        selectedLabels,
                        (label: Label) => label.id,
                    )}
                    selectionType="labels"
                    render={({ name, color }) => (
                        <SampleLabelInner color={color} name={name} />
                    )}
                />
            </SidebarHeader>
            <SampleSidebarMultiselectList items={selectedLabels} />
            {Boolean(labels.length) || (
                <SampleLabelsFooter>
                    No labels found.{" "}
                    <Link to="/samples/labels">Create one</Link>.
                </SampleLabelsFooter>
            )}
        </StyledSideBarSection>
    );
}
