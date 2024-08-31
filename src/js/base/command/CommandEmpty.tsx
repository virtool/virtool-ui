import { NoneFoundSection } from "@base";
import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";

type CommandEmptyProps = {
    id: string;
};

/**
 * Displays if there are no command items in the command list
 */
export function CommandEmpty({ id }: CommandEmptyProps) {
    return <NoneFoundSection as={CommandPrimitive.Empty} noun={`${id}s`} />;
}
