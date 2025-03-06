import { cn } from "@/utils";
import React from "react";
import { Loader } from "./Loader";

type LoadingPlaceholderProps = {
    /* Tailwind CSS classes */
    className?: string;
    /* message to show above the spinner */
    message?: string;
};

/**
 * A component that renders a centered spinner. Used as a placeholder when the rendering of a component depends on an
 * async action such as an API call. An example would be navigating to a sample detail view and showing a spinner while
 * the sample data is retrieved from the server.
 */
export function LoadingPlaceholder({
    className,
    message = "",
}: LoadingPlaceholderProps) {
    return (
        <div className={cn("text-center", "mt-56", className)}>
            {message ? <p>{message}</p> : null}
            <Loader />
        </div>
    );
}
