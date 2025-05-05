import React from "react";
import ContainerSide from "../../../base/ContainerSide";
import DefaultSubtractions from "../Sidebar/DefaultSubtractions";
import SampleLabels from "../Sidebar/SampleLabels";

type SidebarProps = {
    sampleLabels: number[];
    defaultSubtractions: string[];
    onUpdate: (key: string, value: string[] | number[]) => void;
};

export default function Sidebar({
    sampleLabels,
    defaultSubtractions,
    onUpdate,
}: SidebarProps) {
    return (
        <ContainerSide className="flex items-stretch flex-col z-10">
            <SampleLabels
                onUpdate={(selection) => onUpdate("sidebar.labels", selection)}
                sampleLabels={sampleLabels}
            />
            <DefaultSubtractions
                onUpdate={(selection) =>
                    onUpdate("sidebar.subtractionIds", selection)
                }
                defaultSubtractions={defaultSubtractions}
            />
        </ContainerSide>
    );
}
