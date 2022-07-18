import { BoxGroupSearch } from "../../../base";
import React from "react";

export const CreateAnalysisSelectorSearch = ({ label, term, onChange }) => (
    <BoxGroupSearch value={term} placeholder={label} label={label} onChange={value => onChange(value)} />
);
