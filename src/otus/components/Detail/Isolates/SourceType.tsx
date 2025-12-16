import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSelect from "@base/InputSelect";
import InputSimple from "@base/InputSimple";
import { capitalize } from "es-toolkit";
import { UseFormRegister, UseFormWatch } from "react-hook-form";

type IsolateFormValues = {
    sourceName: string;
    sourceType: string;
};

type SourceTypeProps = {
    allowedSourceTypes: string[];
    /** Function to register form fields */
    register: UseFormRegister<IsolateFormValues>;
    /** Indicates whether the source types are restricted */
    restrictSourceTypes: boolean;
    /** Watches for changes in form values */
    watch: UseFormWatch<IsolateFormValues>;
};

/**
 * Displays input for source type in isolate creation dialog
 */
export function SourceType({
    allowedSourceTypes,
    register,
    restrictSourceTypes,
    watch,
}: SourceTypeProps) {
    if (restrictSourceTypes) {
        const optionComponents = allowedSourceTypes.map((sourceType) => (
            <option key={sourceType} value={capitalize(sourceType)}>
                {capitalize(sourceType)}
            </option>
        ));

        return (
            <InputGroup>
                <InputLabel htmlFor="sourceType">Source Type</InputLabel>
                <InputSelect id="sourceType" {...register("sourceType")}>
                    <option key="default" value="unknown">
                        Unknown
                    </option>
                    {optionComponents}
                </InputSelect>
            </InputGroup>
        );
    }

    return (
        <InputGroup>
            <InputLabel htmlFor="sourceType">Source Type</InputLabel>
            <InputSimple
                id="sourceType"
                {...register("sourceType")}
                value={capitalize(watch("sourceType"))}
            />
        </InputGroup>
    );
}
