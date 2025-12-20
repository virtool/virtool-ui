import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { createContext, ReactNode, useContext } from "react";
import { useFetchReference } from "../references/queries";
import { useFetchOTU } from "./queries";

const CurrentOTUContext = createContext(null);

/**
 * Initializes a hook to access the current OTU context within a component
 *
 * @returns The current OTU context
 */
export function useCurrentOtuContext() {
    return useContext(CurrentOTUContext);
}

type CurrentOtuContextProviderProps = {
    children: ReactNode;
    otuId: string;
    refId: string;
};

/**
 * Provides the current OTU context to children components
 *
 * @returns Element wrapping children components with the current OTU context
 */
export function CurrentOtuContextProvider({
    children,
    otuId,
    refId,
}: CurrentOtuContextProviderProps) {
    const { data: otu, isPending: isPendingOTU } = useFetchOTU(otuId);
    const { data: reference, isPending: isPendingReference } =
        useFetchReference(refId);

    if (isPendingOTU || isPendingReference) {
        return <LoadingPlaceholder />;
    }

    return (
        <CurrentOTUContext.Provider value={{ otu, reference }}>
            {children}
        </CurrentOTUContext.Provider>
    );
}
