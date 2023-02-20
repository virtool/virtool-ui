import { createContext } from "react";

type ModalContextType = {
    color?: string;
    onHide?: () => void;
};

export const ModalContext = createContext<ModalContextType>({});
