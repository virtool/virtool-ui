import { useDialogParam } from "../../../app/hooks";
import { cn } from "../../../app/utils";
import CreateIimi from "./CreateIimi";
import CreateNuvs from "./CreateNuvs";
import CreatePathoscope from "./CreatePathoscope";
import Dialog from "../../../base/Dialog";
import DialogOverlay from "../../../base/DialogOverlay";
import DialogTitle from "../../../base/DialogTitle";
import { HmmSearchResults } from "../../../hmm/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import { Tabs } from "radix-ui";
import React from "react";
import HMMAlert from "../HMMAlert";
import CreateAnalysisDialogContent from "./CreateAnalysisDialogContent";
import { getCompatibleWorkflows } from "./workflows";

type CreateAnalysisProps = {
    /** The HMM search results */
    hmms: HmmSearchResults;

    /** The id of the sample being used */
    sampleId: string;
};

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

/**
 * Dialog for creating an analysis
 */
export default function CreateAnalysis({
    hmms,
    sampleId,
}: CreateAnalysisProps) {
    const { open, setOpen } = useDialogParam("openCreateAnalysis");

    const compatibleWorkflows = getCompatibleWorkflows(
        Boolean(hmms.total_count),
    );

    function onOpenChange(open) {
        if (!open) {
            setOpen(false);
        }
    }

    const sampleIds = [sampleId];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay />
                <CreateAnalysisDialogContent>
                    <DialogTitle>Analyze</DialogTitle>
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
                        </Tabs.List>
                        <Content value="iimi">
                            <CreateIimi sampleCount={1} sampleIds={sampleIds} />
                        </Content>
                        <Content value="nuvs">
                            <CreateNuvs sampleCount={1} sampleIds={sampleIds} />
                        </Content>
                        <Content value="pathoscope_bowtie">
                            <CreatePathoscope
                                sampleCount={1}
                                sampleIds={sampleIds}
                            />
                        </Content>
                    </Tabs.Root>
                </CreateAnalysisDialogContent>
            </DialogPortal>
        </Dialog>
    );
}
