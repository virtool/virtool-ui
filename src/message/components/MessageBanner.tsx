import { cn } from "@/app/utils";
import React from "react";
import { useFetchMessage } from "../queries";

/**
 * Displays the banner containing the instance message
 */
export default function MessageBanner() {
    const { data, isPending } = useFetchMessage();

    return !isPending && data?.message ? (
        <div
            className={cn(
                "bg-red-500",
                "font-medium",
                "px-3",
                "py-1",
                "text-white",
                "text-lg",
            )}
        >
            {data.message}
        </div>
    ) : null;
}
