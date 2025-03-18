import { useDialogParam } from "@/hooks";
import { cn } from "@/utils";
import CreateIimi from "@analyses/components/Create/CreateIimi";
import CreateNuvs from "@analyses/components/Create/CreateNuvs";
import CreatePathoscope from "@analyses/components/Create/CreatePathoscope";
import Dialog from "@base/Dialog";
import DialogOverlay from "@base/DialogOverlay";
import DialogTitle from "@base/DialogTitle";
import { HmmSearchResults } from "@hmm/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { SampleMinimal } from "@samples/types";
import { SubtractionOption } from "@subtraction/types";
import { Tabs } from "radix-ui";
import React, { useEffect } from "react";
import styled from "styled-components";
import HMMAlert from "../HMMAlert";
import CreateAnalysisDialogContent from "./CreateAnalysisDialogContent";
import { SelectedSamples } from "./SelectedSamples";
import { getCompatibleWorkflows } from "./workflows";

function Content({ children, value }) {
    return (
        <Tabs.Content
            className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={value}
        >
            {children}
        </Tabs.Content>
    );
}

const QuickAnalyzeSelected = styled.span`
    align-self: center;
    margin: 0 15px 0 auto;
`;

type QuickAnalyzeProps = {
    /** The HMM search results */
    hmms: HmmSearchResults;

    /** A callback function to clear selected samples */
    onClear: () => void;

    /** The selected samples */
    samples: SampleMinimal[];

    /** A shortlist of ready subtractions */
    subtractionOptions: SubtractionOption[];
};

/**
 * A form for triggering quick analyses on selected samples
 */
export default function QuickAnalyze({ hmms, samples }: QuickAnalyzeProps) {
    const { open, setOpen } = useDialogParam("openQuickAnalysis");

    // The dialog should close when all selected samples have been analyzed and deselected.
    useEffect(() => {
        if (samples.length === 0) {
            setOpen(false);
        }
    }, [samples, setOpen]);

    const compatibleWorkflows = getCompatibleWorkflows(hmms.total_count > 0);

    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogPortal>
                <DialogOverlay />
                <CreateAnalysisDialogContent>
                    <DialogTitle>Quick Analyze</DialogTitle>
                    <QuickAnalyzeSelected>
                        {samples.length} sample
                        {samples.length > 1 ? "s" : ""} selected
                    </QuickAnalyzeSelected>
                    <SelectedSamples samples={samples} />
                    <HMMAlert installed={hmms.status.task?.complete} />
                    <Tabs.Root defaultValue="pathoscope_bowtie">
                        <Tabs.List
                            className={cn(
                                "bg-gray-100",
                                "flex",
                                "h-12",
                                "items-center",
                                "justify-center",
                                "p-1",
                                "rounded-lg",
                                "inset-1",
                                "text-lg",
                                "text-muted-foreground",
                            )}
                        >
                            {compatibleWorkflows.map((workflow) => (
                                <Tabs.Trigger
                                    className={cn(
                                        "font-medium",
                                        "inline-flex",
                                        "items-center",
                                        "justify-center",

                                        "px-3",
                                        "py-1",
                                        "rounded-md",
                                        "ring-offset-background",
                                        "transition-all",
                                        "focus-visible:outline-none",
                                        "focus-visible:ring-2",
                                        "focus-visible:ring-ring",
                                        "focus-visible:ring-offset-2",
                                        "disabled:pointer-events-none",
                                        "disabled:opacity-50",
                                        "data-[state=active]:bg-white",
                                        "data-[state=active]:text-foreground",
                                        "data-[state=active]:shadow",
                                        "whitespace-nowrap",
                                    )}
                                    key={workflow.id}
                                    value={workflow.id}
                                >
                                    {workflow.name}
                                </Tabs.Trigger>
                            ))}
                        </Tabs.List>{" "}
                        <Content value="iimi">
                            <CreateIimi sampleCount={1} sampleId={sampleId} />
                        </Content>
                        <Content value="nuvs">
                            <CreateNuvs sampleCount={1} sampleId={sampleId} />
                        </Content>
                        <Content value="pathoscope_bowtie">
                            <CreatePathoscope
                                sampleCount={1}
                                sampleId={sampleId}
                            />
                        </Content>
                    </Tabs.Root>
                </CreateAnalysisDialogContent>
            </DialogPortal>
        </Dialog>
    );
}
