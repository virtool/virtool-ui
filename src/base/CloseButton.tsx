import { X } from "lucide-react";
import IconButton from "./IconButton";

type CloseButtonProps = {
    onClick: () => void;
};

export default function CloseButton({ onClick }: CloseButtonProps) {
    return <IconButton IconComponent={X} tip="close" onClick={onClick} />;
}
