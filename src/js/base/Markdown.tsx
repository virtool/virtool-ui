import { cn } from "@/utils";
import { marked } from "marked";
import React from "react";
import { NoneFound } from "./NoneFound";

type MarkdownProps = {
    markdown?: string;
};

/**
 * A styled component that parses, formats, and displays markdown content
 */
export function Markdown({ markdown = "" }: MarkdownProps) {
    marked.use({
        gfm: true,
        async: false,
    });

    if (markdown) {
        return (
            <div
                className={cn(
                    "overflow-y-scroll",
                    "max-h-96",
                    "mb-0",
                    "py-2.5",
                    "px-4",
                )}
                dangerouslySetInnerHTML={{
                    __html: marked.parse(markdown) as string,
                }}
            />
        );
    }

    return (
        <div
            className={cn(
                "overflow-y-scroll",
                "max-h-96",
                "mb-0",
                "py-2.5",
                "px-4",
            )}
        >
            <NoneFound noun="notes" />
        </div>
    );
}
