import { fontWeight, getColor, getFontSize } from "@app/theme";
import Link from "@base/Link";
import SidebarHeader from "@base/SidebarHeader";
import SideBarSection from "@base/SideBarSection";
import { Label } from "@labels/types";
import { useUpdateLabel } from "@samples/queries";
import { SampleMinimal } from "@samples/types";
import { groupBy } from "es-toolkit";
import styled from "styled-components";
import SampleLabel from "../Label/SampleLabel";
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
    const allLabels = document.flatMap((d) => d.labels);
    const grouped = groupBy(allLabels, (label) => label.id);

    return Object.values(grouped).map((labels) => ({
        ...labels[0],
        count: labels.length,
        allLabeled: labels.length === document.length,
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
    const partiallySelectedLabels = selectedLabels.filter(
        (label) => !label.allLabeled,
    );
    const onUpdateLabel = useUpdateLabel(selectedLabels, selectedSamples);

    return (
        <StyledSideBarSection>
            <SidebarHeader>
                Manage Labels
                <SampleSidebarSelector
                    items={labels}
                    manageLink={"/samples/labels"}
                    onUpdate={onUpdateLabel}
                    partiallySelectedItems={partiallySelectedLabels.map(
                        (label) => label.id,
                    )}
                    selectedIds={selectedLabels.map((label) => label.id)}
                    selectionType="labels"
                    render={({ name, color }) => (
                        <SampleLabel color={color} name={name} size="sm" />
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
