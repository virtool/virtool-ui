import InputSearch from "@base/InputSearch";
import Toolbar from "@base/Toolbar";

type HMMToolbarProps = {
    /** Current search term used for filtering */
    term: string;
    /** A callback function to handle changes in search input */
    onChange: (term: any) => void;
};

/**
 * A toolbar which allows the HMMs to be filtered by their names
 */
export default function HMMToolbar({ term, onChange }: HMMToolbarProps) {
    return (
        <Toolbar>
            <div className="flex-grow">
                <InputSearch
                    placeholder="Definition"
                    onChange={onChange}
                    value={term}
                />
            </div>
        </Toolbar>
    );
}
