import InputSearch from "../../../base/InputSearch";
import InputSimple from "../../../base/InputSimple";
import Toolbar from "../../../base/Toolbar";
import numbro from "numbro";
import React from "react";

type IimiToolbarProps = {
    minimumProbability: number;
    term: string;
    setMinimumProbability: (value: number) => void;
    setTerm: (value: string) => void;
};

export default function IimiToolbar({
    minimumProbability,
    term,
    setMinimumProbability,
    setTerm,
}: IimiToolbarProps) {
    const value = numbro(minimumProbability).format("0.000");
    return (
        <Toolbar>
            <InputSearch
                value={term}
                onChange={(e) => setTerm(e.target.value)}
            />
            <form>
                <InputSimple
                    type="number"
                    max={1}
                    min={0}
                    onChange={(e) =>
                        setMinimumProbability(parseFloat(e.target.value))
                    }
                    step={0.005}
                    value={value}
                />
            </form>
        </Toolbar>
    );
}
