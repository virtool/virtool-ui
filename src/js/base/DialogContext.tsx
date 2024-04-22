import { createContext } from "react";

type DialogContextType = {
    color?: string;
    onHide?: () => void;
};

export const DialogContext = createContext<DialogContextType>({});
