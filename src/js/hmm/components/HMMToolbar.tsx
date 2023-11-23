import React from "react";
import { InputSearch, Toolbar } from "../../base";

type HMMToolbarProps = {
    /** Current search term used for filtering */
    term: string;
    /** A callback function to handle changes in search input */
    onChange: (term: any) => void;
};

/**
 * A search filtering toolbar
 */
export default function HMMToolbar({ term, onChange }: HMMToolbarProps) {
    return (
        <Toolbar>
            <InputSearch placeholder="Definition" onChange={onChange} value={term} />
        </Toolbar>
    );
}
