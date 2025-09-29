import IconButton from "./IconButton";

type CloseButtonProps = {
    onClick: () => void;
};

export default function CloseButton({ onClick }: CloseButtonProps) {
    return <IconButton name="times" tip="close" onClick={onClick} />;
}
