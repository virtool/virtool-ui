import { ScrollSyncContext } from "@base/ScrollSyncContext";
import { cn } from "@/utils";
import React, { useContext, useEffect, useRef } from "react";

type ScrollSyncProps = {
    children: React.ReactNode;
    className?: string;
};

/**
 * Coordinates scroll positions between the child ScrollSync components.
 *
 * @param children - the components to manage scroll for
 * @param className - additional classes to apply to the container
 */
export default function ScrollSync({ children, className }: ScrollSyncProps) {
    const [scrollPixels, setScrollPixels] = useContext(ScrollSyncContext);
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current as HTMLElement;

        function handleScroll() {
            setScrollPixels(element.scrollLeft);
        }

        element.addEventListener("scroll", handleScroll);

        return () => {
            element.removeEventListener("scroll", handleScroll);
        };
    }, [setScrollPixels]);

    useEffect(() => {
        if (ref.current && scrollPixels !== undefined) {
            ref.current.scrollLeft = scrollPixels;
        }
    }, [scrollPixels]);

    return (
        <div
            className={cn(
                "overflow-x-auto",
                "relative",
                "whitespace-nowrap",
                className,
            )}
            ref={ref}
        >
            {children}
        </div>
    );
}
