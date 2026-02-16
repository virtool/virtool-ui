import Box from "@base/Box";
import Button from "@base/Button";
import Icon from "@base/Icon";
import { Redo2 } from "lucide-react";

export default function NuvsBlastError({ error, onBlast }) {
    return (
        <Box className="flex items-center justify-between">
            <span>
                <strong>Error during BLAST request.</strong>
                <span> {error}</span>
            </span>
            <Button onClick={onBlast} color="blue">
                <Icon icon={Redo2} /> Retry
            </Button>
        </Box>
    );
}
