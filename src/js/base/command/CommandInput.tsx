import { Input, InputContainer, InputIcon } from "@base";
import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";
import { forwardRef } from "react";

/**
 * A search input container for use in a command list
 */
export const CommandInput = forwardRef<
    React.ElementRef<typeof CommandPrimitive.Input>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
    return (
        <div className="m-2">
            <InputContainer align="left">
                <Input as={CommandPrimitive.Input} ref={ref} autoFocus {...props} />
                <InputIcon name="search" />
            </InputContainer>
        </div>
    );
});
