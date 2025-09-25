import { useDialogParam, useUrlSearchParam } from "@app/hooks";
import { cn } from "@app/utils";
import Badge from "@base/Badge";
import BoxGroupSection from "@base/BoxGroupSection";
import Dialog from "@base/Dialog";
import DialogOverlay from "@base/DialogOverlay";
import DialogTitle from "@base/DialogTitle";
import { useListHmms } from "@hmm/queries";
import { DialogPortal } from "@radix-ui/react-dialog";
import { SampleMinimal } from "@samples/types";
import { Tabs } from "radix-ui";
import React, { useEffect } from "react";
import HMMAlert from "../HMMAlert";
import CreateAnalysisDialogContent from "./CreateAnalysisDialogContent";
import CreateAnalysisFieldTitle from "./CreateAnalysisFieldTitle";
import CreateIimi from "./CreateIimi";
import CreateNuvs from "./CreateNuvs";
import CreatePathoscope from "./CreatePathoscope";
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

type QuickAnalyzeProps = {
    /** A callback function to clear selected samples */
    onClear: () => void;

    /** The selected samples */
    samples: SampleMinimal[];
};

/**
 * A form for triggering quick analyses on selected samples
 */
export default function QuickAnalyze({ samples }: QuickAnalyzeProps) {
    const { open, setOpen } = useDialogParam("openQuickAnalyze");
    const { unsetValue: unsetQuickAnalysisType } =
        useUrlSearchParam("quickAnalysisType");
    const { data: hmms, isPending } = useListHmms(1, 1, "");

    // The dialog should close when all selected samples have been analyzed and deselected.
    useEffect(() => {
        if (samples.length === 0) {
            setOpen(false);
            unsetQuickAnalysisType();
        }
    }, [samples, setOpen, unsetQuickAnalysisType]);

    function onOpenChange(open: boolean) {
        setOpen(open);
        if (!open) {
            unsetQuickAnalysisType();
        }
    }

    if (isPending) {
        return null;
    }

    const compatibleWorkflows = getCompatibleWorkflows(hmms.total_count > 0);

    const sampleIds = samples.map((sample) => sample.id);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay />
                <CreateAnalysisDialogContent>
                    <DialogTitle>Quick Analyze</DialogTitle>
                    <HMMAlert installed={hmms.status.task?.complete} />

                    <Tabs.Root defaultValue="pathoscope_bowtie">
                        <Tabs.List
                            className={cn(
                                "bg-gray-100",
                                "flex",
                                "h-12",
                                "items-center",
                                "justify-center",
                                "mb-4",
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
                        <CreateAnalysisFieldTitle>
                            Compatible Samples <Badge>{samples.length}</Badge>
                        </CreateAnalysisFieldTitle>
                        <div
                            className={cn(
                                "border",
                                "border-gray-300",
                                "mb-4",
                                "max-h-32",
                                "overflow-y-scroll",
                                "rounded-sm",
                            )}
                        >
                            {samples.map(({ id, name }) => (
                                <BoxGroupSection key={id} disabled>
                                    {name}
                                </BoxGroupSection>
                            ))}
                        </div>
                        <Content value="iimi">
                            <CreateIimi
                                sampleCount={sampleIds.length}
                                sampleIds={sampleIds}
                            />
                        </Content>
                        <Content value="nuvs">
                            <CreateNuvs
                                sampleCount={sampleIds.length}
                                sampleIds={sampleIds}
                            />
                        </Content>
                        <Content value="pathoscope_bowtie">
                            <CreatePathoscope
                                sampleCount={sampleIds.length}
                                sampleIds={sampleIds}
                            />
                        </Content>
                    </Tabs.Root>
                </CreateAnalysisDialogContent>
            </DialogPortal>
        </Dialog>
    );
}
