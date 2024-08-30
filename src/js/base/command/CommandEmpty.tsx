import { NoneFoundSection } from "@base";
import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";

/**
 * Displays if there are no command items in the command list
 */
export function CommandEmpty({ noun }) {
    return <NoneFoundSection as={CommandPrimitive.Empty} noun={`${noun}s`} />;
}
